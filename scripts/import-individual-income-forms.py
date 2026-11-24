"""Import inert printable form layouts from an extracted eBIRForms v7.9.6.2 resources folder."""
import argparse
import hashlib
import json
import re
import shutil
import struct
from pathlib import Path

from bs4 import BeautifulSoup, Comment, Tag


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'src/lib/forms/individual-income/templates'
ASSETS = ROOT / 'static/legacy/individual-income'
PUBLIC = '/legacy/individual-income/'
CODES = ('1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018')
TAGS = set('div span table thead tbody tfoot tr td th col colgroup input select option textarea label img br p b strong em i u font center small sub sup hr a h1 h2 h3 h4 ol ul li fieldset legend nobr'.split())
ATTRIBUTES = set('id class style title name type maxlength size rows cols colspan rowspan width height valign align border cellspacing cellpadding src alt for value selected checked'.split())
DYNAMIC_RDO = {
    '1700v2018': ('frm1700:txtRDOCode', 'frm1700:txtSpouseRDOCode'),
    '1701v2018': ('frm1701:txtPg1I5RDOCode', 'frm1701:txtPg2I2SpouseRDOCode'),
    '1701A': ('frm1701A:txtRDOCode', 'frm1701A:txtSpouseRDOCode'),
    '1701Q': ('frm1701q:txt5RDOCode', 'frm1701q:txt7RDOCode'),
    '1701Qv2018': ('frm1701q:txtRDOCode', 'frm1701q:txtSpouseRDOCode'),
}
NON_DATA = re.compile(r'currentPage|maxPage|finalFlag|txtEnroll|ebirOnline|driveSelect|^resultSched|^resultOtherSpecify|(?:zip|lob)Container|^txtEmail$', re.I)
# Centers and bounds of the branch digits baked into the 850×1300 print PNGs.
OCR_1700_BRANCH_BOXES = {
    1: (
        ('txtPg1Pt1I5BranchCode', (437, 456, 478, 500), 215, 19, 16),
        ('txtPg1Pt1I17SpouseBranchCode', (417, 435, 457, 479), 522, 19, 16),
    ),
    2: (('txtPg2Pt4BranchCode', (231, 253, 275, 297), 122, 15, 12),),
    3: (('txtPg3Pt5BranchCode', (243, 267, 290, 314), 123, 15, 12),),
    4: (('txtPg4BranchCode', (248, 270, 292, 315), 165, 15, 12),),
}
# Pixel centers of the branch digits printed as zeros in the original art.
OCR_1701_BRANCH_BOXES = (
    ((566, 591, 613, 634), 212),
    ((237, 260, 283, 306), 145),
    ((237, 260, 283, 307), 141),
    ((237, 260, 283, 307), 154),
    ((221, 244, 267, 290), 138),
    ((230, 253, 276, 298), 142),
    ((232, 255, 278, 300), 153),
    ((232, 255, 278, 300), 153),
    ((231, 253, 276, 299), 134),
    ((232, 255, 278, 300), 156),
    ((232, 254, 278, 300), 153),
    ((338, 359, 379, 400), 161),
)


def copy_asset(resources, reference):
    relative = reference.removeprefix('../img/').replace('\\', '/')
    source = resources / 'img' / relative
    if not source.is_file() or not source.resolve().is_relative_to((resources / 'img').resolve()):
        raise ValueError(f'Missing package image {reference}')
    name = re.sub(r'[^A-Za-z0-9_.-]', '-', relative.replace('/', '-'))
    shutil.copyfile(source, ASSETS / name)
    return PUBLIC + name


def source_css(tag):
    return {name.strip(): value.strip() for declaration in tag.get('style', '').split(';')
            for name, separator, value in [declaration.partition(':')] if separator}


def append_1700_branch_boxes(sheet, number, image_css):
    # The shipped preview scales the source PNG before placing its text.
    scale_x = int(image_css['width'].removesuffix('px')) / 850
    scale_y = int(image_css['height'].removesuffix('px')) / 1300
    offset_x = int(image_css.get('margin-left', '0px').removesuffix('px'))
    offset_y = int(image_css['top'].removesuffix('px'))
    append_ocr_branch_boxes(sheet, OCR_1700_BRANCH_BOXES[number], scale_x, scale_y, offset_x, offset_y)


def append_ocr_branch_boxes(sheet, boxes, scale_x, scale_y, offset_x=0, offset_y=0):
    for field, centers, top, height, width in boxes:
        x = centers[0] - width / 2
        branch = Tag(name='div', attrs={
            'class': 'legacy-1700-print-value legacy-1700-print-branch',
            'style': f'left:{offset_x + x * scale_x:.2f}px;top:{offset_y + top * scale_y:.2f}px;'
                     f'width:{(centers[-1] - centers[0] + width) * scale_x:.2f}px;height:{height * scale_y:.2f}px',
        })
        value = Tag(name='span', attrs={'data-legacy-print-id': field})
        for index, center in enumerate(centers, start=1):
            value.append(Tag(name='span', attrs={
                'data-legacy-branch-part': str(index),
                'style': f'left:{(center - centers[0]) * scale_x:.2f}px;width:{width * scale_x:.2f}px',
            }))
        branch.append(value)
        sheet.append(branch)
        sheet.append('\n')


def import_1700_ocr(resources, soup):
    """Extract the layout shown by the bundle's Print Preview command."""
    pages = []
    for number in range(1, 5):
        page = soup.find(id=f'Print{number}Content')
        image = page.find('img')
        image_css = source_css(image)
        background = soup.new_tag('img', attrs={
            'alt': f'BIR Form 1700, June 2013, page {number}',
            'class': 'legacy-1700-print-background',
            'src': copy_asset(resources, image['src']),
            'width': image_css['width'].removesuffix('px'),
            'height': image_css['height'].removesuffix('px'),
            'style': f"left:{image_css.get('margin-left', '0px')};top:{image_css['top']}",
        })
        sheet = Tag(name='div', attrs={
            'class': 'individual-income-sheet legacy-1700-ocr',
            'data-income-page': str(number),
        })
        sheet.append('\n')
        sheet.append(background)
        sheet.append('\n')
        for value in page.select('span[id]'):
            placement = source_css(value.parent)
            typography = source_css(value)
            box_css = {key: placement[key] for key in ('left', 'top', 'width', 'height')
                       if key in placement and re.fullmatch(r'-?\d+px', placement[key])}
            if not {'left', 'top'} <= box_css.keys():
                raise ValueError(f'Missing OCR print coordinates for {value["id"]}')
            align = typography.get('text-align', placement.get('text-align'))
            if align in ('left', 'right', 'center'):
                box_css['text-align'] = align
            if placement.get('overflow') == 'hidden':
                box_css['overflow'] = 'hidden'
            box = Tag(name='div', attrs={
                'class': 'legacy-1700-print-value',
                'style': ';'.join(f'{key}:{setting}' for key, setting in box_css.items()),
            })
            span = Tag(name='span', attrs={'data-legacy-print-id': value['id']})
            spacing = typography.get('letter-spacing', '')
            if re.fullmatch(r'-?\d+(?:\.\d+)?(?:px|pt|em)', spacing):
                span['style'] = f'letter-spacing:{spacing}'
            box.append(span)
            sheet.append(box)
            sheet.append('\n')
        append_1700_branch_boxes(sheet, number, image_css)
        pages.append(str(sheet))
    (TARGET / 'form-1700-ocr.html').write_text('\n'.join(pages) + '\n')


def import_1701_ocr(resources, soup):
    """Preserve base-page positioning groups from the June 2013 Print Preview."""
    pages = []
    for number, (centers, top) in enumerate(OCR_1701_BRANCH_BOXES, start=1):
        page = soup.find(id=f'Print{number}Content')
        image = page.find('img')
        reference = image['src']
        asset = (resources / 'img' / reference.removeprefix('../img/')).read_bytes()
        if not asset.startswith(b'\x89PNG\r\n\x1a\n'):
            raise ValueError(f'Expected PNG artwork for Form 1701 page {number}')
        native_width, native_height = struct.unpack('>II', asset[16:24])
        height = int(source_css(image)['height'].removesuffix('px'))
        scale = height / native_height
        width = round(native_width * scale)
        background = Tag(name='img', attrs={
            'alt': f'BIR Form 1701, June 2013, page {number}',
            'class': 'legacy-1701-print-background',
            'src': copy_asset(resources, reference),
            'width': width, 'height': height,
        })
        sheet = Tag(name='div', attrs={
            'class': 'individual-income-sheet legacy-1701-ocr',
            'data-income-page': str(number),
            'style': f'width:{width}px;height:{height}px',
        })
        sheet.append(background)
        sheet.append('\n')
        for group in page.find_all('div', recursive=False):
            sheet.append(copy_1701_ocr_group(group))
            sheet.append('\n')
        id_by_page = {1: 'txtPg1Pt1I5TIN4', **{i: f'txtPg{i}TIN4' for i in (2, 3, 4, 5, 12)}}
        boxes = [(id_by_page.get(number, f'txtPg{number}BranchCode'), centers, top - 2, 15, 14)]
        if number == 4:
            boxes.append(('txtPg4Pt7I95SpouseTIN4', (526, 547, 569, 590), 202, 15, 14))
        append_ocr_branch_boxes(sheet, boxes, scale, scale)
        pages.append(str(sheet))
    (TARGET / 'form-1701-ocr.html').write_text('\n'.join(pages) + '\n')


def copy_1701_ocr_group(source):
    if source.name == 'span':
        clone = Tag(name='span', attrs={'data-legacy-print-id': source['id']})
        declarations = {key: value for key, value in source_css(source).items()
                        if key in ('font-size', 'letter-spacing') and re.fullmatch(r'\d+(?:\.\d+)?(?:pt|px)', value)}
    else:
        clone = Tag(name='div')
        if source.find('span', recursive=False):
            clone['class'] = 'legacy-1701-print-value'
        declarations = {key: value for key, value in source_css(source).items()
                        if ((key in ('top', 'left', 'width', 'height', 'letter-spacing') and re.fullmatch(r'-?\d+px', value))
                            or (key, value) in (('position', 'absolute'), ('position', 'relative'),
                                               ('float', 'left'), ('text-align', 'right')))}
        for child in source.find_all(['div', 'span'], recursive=False):
            clone.append(copy_1701_ocr_group(child))
    if declarations:
        clone['style'] = ';'.join(f'{key}:{value}' for key, value in declarations.items())
    return clone


def label_for(control, key):
    parent = control.find_parent(['td', 'th'])
    text = ''
    if parent:
        # Amount columns contain little text. The neighboring cell holds the item name.
        text = parent.get_text(' ', strip=True)
        if len(text) < 3:
            row = parent.find_parent('tr')
            if row:
                text = row.get_text(' ', strip=True)
    if not text or len(text) > 120:
        tail = key.split(':')[-1]
        text = re.sub(r'(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', ' ', tail)
        text = re.sub(r'^(txt|rdo|opt|hdn|ddl|chk)\s*', '', text, flags=re.I).strip()
    return ' '.join(text.split()) or key


def sanitize_page(page, resources, code, fields, page_name):
    for comment in page.find_all(string=lambda value: isinstance(value, Comment)):
        comment.extract()
    for tag in list(page.find_all(['script', 'style', 'object', 'iframe', 'button', 'link', 'svg', 'template', 'noscript', 'form'])):
        if tag.parent:
            tag.decompose()
    section = 'Filing details' if page_name == '1' else 'Return details'
    for tag in list(page.find_all(True)):
        if not tag.parent:
            continue
        if tag.name not in TAGS:
            tag.unwrap()
            continue
        if tag.name in ('td', 'th') and not tag.select_one('input, select, textarea, table'):
            heading = ' '.join(tag.get_text(' ', strip=True).split())
            if len(heading) <= 120 and re.match(r'^(?:Part\s+[IVX]+(?:[.-][A-Z])?\b|Schedule\s+[A-Z0-9]+\b)', heading, re.I):
                section = heading
        if tag.name in ('input', 'select', 'textarea'):
            field_id = tag.get('id', '').strip()
            field_type = tag.get('type', 'text').lower()
            if field_type in ('button', 'submit', 'hidden', 'password', 'reset', 'file', 'image') or not field_id or (
                NON_DATA.search(field_id) and (field_id != 'txtEmail' or code == '1701MS')
            ):
                tag.decompose()
                continue
            compensation_assignment = code in ('1700', '1700v2018') and field_type == 'checkbox' and re.fullmatch(
                r'frm1700:(?:rdoPg2(?:I\d+PartVIEmployee|Pt4I\d+Employer)|rdoPg1Pt1I14ClaimingAdditionalExemptions|rdoPg1Pt1I21SpouseClaimAdditionalExemption)', tag.get('name', '')
            )
            is_group = field_type == 'radio' or compensation_assignment
            if compensation_assignment:
                tag['data-income-choice'] = 'true'
            key = (tag.get('name') or field_id).strip() if is_group else field_id
            value = tag.get('value', '').strip()
            if is_group:
                if code == '1701v2018' and field_id.endswith(('AmendedNo', 'ShortPeriodNo')):
                    value = 'No'
                if not value:
                    value = field_id
                if code == '1701' and 'refund' in key.lower():
                    value = 'CarryOver' if 'carry' in field_id.lower() else 'TCC' if 'tcc' in field_id.lower() else 'Refund'
                tag['value'] = value
                tag['name'] = key
            choices = [option.get('value', option.get_text(strip=True)) for option in tag.find_all('option')]
            optional_share_kind = (
                code == '1700' and field_id in ('frm1700:drpPg3Pt5I12A1', 'frm1700:drpPg3Pt5I12B2')
            ) or (
                code == '1701' and field_id in ('frm1701:ddlPg11Sc12AI12KindPSCSC1', 'frm1701:ddlPg11Sc12AI12KindPSCSC2')
            )
            if tag.name == 'select':
                selected = tag.find('option', selected=True) or tag.find('option')
                value = selected.get('value', selected.get_text(strip=True)) if selected else ''
            default = value if not is_group and field_type != 'checkbox' else ''
            if optional_share_kind:
                default = ''
            if tag.has_attr('checked'):
                default = value if is_group else 'Y'
            label = label_for(tag, key)
            label_for_id = page.find('label', attrs={'for': field_id}) if is_group or field_type == 'checkbox' else None
            choice_label = label_for_id.get_text(' ', strip=True) if label_for_id else value
            max_length = tag.get('maxlength', '')
            money = bool(re.fullmatch(r'-?0\.00', value) or re.search(r'(?i)(?:numberOnlyWithDecimal|formatCurrency|formatNumber|formatAmt|extractNumber|addComma)', ' '.join(str(value) for name, value in tag.attrs.items() if name.startswith('on'))))
            field = fields.setdefault(key, {'id': key, 'label': label, 'type': 'select' if choices or is_group else 'number' if money else 'text', 'defaultValue': '', 'options': []})
            field.setdefault('page', page_name)
            field.setdefault('section', section)
            field.setdefault('kind', 'radio' if is_group else 'checkbox' if field_type == 'checkbox' else 'select' if tag.name == 'select' else 'money' if money else 'text')
            field.setdefault('maxLength', int(max_length) if max_length.isdigit() else None)
            choice_labels = field.setdefault('choiceLabels', {})
            if is_group:
                choice_labels[value] = choice_label
            if tag.name == 'select':
                choice_labels.update({option.get('value', option.get_text(strip=True)): option.get_text(' ', strip=True) for option in tag.find_all('option')})
            if optional_share_kind:
                # A serialized select falls back to its first option if it has no selected value.
                tag.insert(0, Tag(name='option', attrs={'value': ''}))
                tag.insert(0, '\n')
            if field_type == 'checkbox' and label_for_id:
                field['label'] = label_for_id.get_text(' ', strip=True)
            if choices or is_group:
                field['options'].extend(choice for choice in choices + ([value] if is_group else []) if choice not in field['options'])
            if default and not field['defaultValue']:
                field['defaultValue'] = default
            tag['data-income-field'] = key
            tag['aria-label'] = f'{label} — {value}' if is_group and value != field_id else label
            if money:
                tag['inputmode'] = 'decimal'
        for name in list(tag.attrs):
            if name not in ATTRIBUTES and name not in ('data-income-field', 'data-income-choice', 'aria-label', 'inputmode'):
                del tag.attrs[name]
        if tag.name == 'a' and re.fullmatch(r'\(?add more\.{0,3}\)?', tag.get_text(strip=True), flags=re.I):
            tag.decompose()
            continue
        if tag.name == 'img':
            reference = tag.get('src', '')
            if not reference.startswith('../img/'):
                tag.decompose()
                continue
            tag['src'] = copy_asset(resources, reference)
            if 'alt' not in tag.attrs:
                tag['alt'] = ''
        elif tag.has_attr('src'):
            del tag.attrs['src']
        if tag.has_attr('style'):
            tag['style'] = re.sub(r'(?i)(?:expression\s*\(|url\s*\(|behavior\s*:)[^;]*', '', tag['style'])


def import_layouts(resources):
    TARGET.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    inventory = {}
    provenance = {}
    for code in CODES:
        source = resources / 'forms' / f'BIR-Form{code}.hta'
        package_bytes = source.read_bytes()
        soup = BeautifulSoup(package_bytes.decode('utf-8-sig'), 'lxml')
        if code == '1700':
            import_1700_ocr(resources, soup)
        if code == '1701':
            import_1701_ocr(resources, soup)
        paper = soup.find(id='formPaper')
        if code in DYNAMIC_RDO:
            for placeholder in paper.find_all(id=re.compile(r'^(?:rdoSelect2?|rdoSpouseSelect|spouseRdoSelect)$', re.I)):
                field_id = DYNAMIC_RDO[code][int(placeholder['id'].lower() != 'rdoselect')]
                control = soup.new_tag('input', id=field_id, type='text', maxlength='3', size='4')
                placeholder.append(control)
        if code == '1701':
            spouse_rdo = paper.find(id='rdoContainerPage4')
            if spouse_rdo:
                spouse_rdo.append(soup.new_tag('input', id='frm1701:ddlPg1Pt4I96RDOCode', type='text', maxlength='3', size='4'))
            control = paper.find(id='frm1701:hdnPg1Pt1I6RDOCode')
            if control:
                hidden = control.find_parent(style=re.compile(r'display\s*:\s*none', re.I))
                if hidden and hidden is not paper:
                    hidden['style'] = re.sub(r'display\s*:[^;]*;?', '', hidden['style'], flags=re.I)
        source_pages = paper.find_all(id=re.compile(r'^Page\d+(?:m(?:TYPE)?)?Content$'))
        fields = {}
        pages = []
        for page in source_pages or [paper]:
            name = page.get('id', '').removeprefix('Page').removesuffix('Content')
            name = '1' if page is paper else name
            if not page.select_one('input, select, textarea'):
                continue
            sanitize_page(page, resources, code, fields, name)
            if page is paper:
                page.attrs = {}
                for footer in page.find_all(id=re.compile(r'PageFooter|bg|printSignFooter', re.I)):
                    if footer.parent and footer.get('id', '').lower() != 'bcs_bg':
                        footer.decompose()
            else:
                page['style'] = re.sub(r'(?i)(?:display|margin-left)\s*:[^;]*;?', '', page.get('style', ''))
                # The legacy attachment pages are wider than the base paper. Fix their
                # source width before zoom so CSS percentages cannot expand in a print frame.
                def fixed_width(match):
                    return f'width: {round(852 * int(match[1]) / 100)}px'
                page['style'] = re.sub(r'(?i)width\s*:\s*(\d+)%', fixed_width, page['style'])
            page.attrs.pop('id', None)
            page['data-income-page'] = name
            page['class'] = [*page.get('class', []), 'individual-income-sheet']
            pages.append(str(page))
        (TARGET / f'form-{code.lower()}.html').write_text('\n'.join(pages) + '\n')
        inventory[code] = list(fields.values())
        provenance[code] = {'resource': f'forms/{source.name}', 'sha256': hashlib.sha256(package_bytes).hexdigest(), 'pages': len(pages)}

    css = []
    for name in ('styles.css', 'style2014.css'):
        css.append(re.sub(r'url\(\s*["\']?(\.\./img/[^"\')]+)["\']?\s*\)',
                          lambda match: f'url("{copy_asset(resources, match[1])}")' if (resources / match[1].replace('../img/', 'img/')).is_file() else 'none',
                          (resources / 'css' / name).read_text(encoding='utf-8-sig')))
    (TARGET / 'source-layout.css').write_text('\n'.join(css))
    (TARGET / 'fields.json').write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n')
    (TARGET / 'provenance.json').write_text(json.dumps({'packageVersion': '7.9.6.2', 'forms': provenance}, indent=2) + '\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('resources', type=Path)
    import_layouts(parser.parse_args().resources)
