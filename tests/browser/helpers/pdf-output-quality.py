"""Inspect exported PDF vectors/text and compare targeted clipping to unclipped output.

Requires PyMuPDF (python3 -m pip install pymupdf). The reference PDF is produced
from the same snapshot with only the investigated value clips disabled. It is
never used as the exported artifact.
"""
import argparse
import json
import fitz

parser = argparse.ArgumentParser()
parser.add_argument('pdf')
parser.add_argument('--reference')
parser.add_argument('--radio-regions')
parser.add_argument('--font-size', type=float, default=7.38)
parser.add_argument('--token', default='HARBORVIEW')
args = parser.parse_args()
doc = fitz.open(args.pdf)
regions = json.load(open(args.radio_regions)) if args.radio_regions else None
issues = []
circles = 0
dots = 0
value_spans = []
for index, page in enumerate(doc):
    page_rings = []
    page_dots = []
    targets = [r for r in regions if r['page'] == index + 1] if regions is not None else None
    # Cubic Bezier segments are the vector circles emitted by the renderer.
    # Exclude artwork/logo curves and full-size decoration by physical size.
    for drawing in page.get_drawings():
        items = drawing['items']
        rect = drawing['rect']
        if len(items) < 4 or not all(item[0] == 'c' for item in items):
            continue
        if not (1 < rect.width < 12 and 1 < rect.height < 12):
            continue
        # Restrict to known radio positions; instructional bullet points are
        # also circular vector paths but intentionally have no outer ring.
        if targets is not None and not any(
            abs((rect.x0 + rect.x1) / 2 - r['x']) < 1.5
            and abs((rect.y0 + rect.y1) / 2 - r['y']) < 1.5 for r in targets
        ):
            continue
        circles += 1
        if drawing.get('fill') == (0.0, 0.0, 0.0):
            dots += 1
            page_dots.append(rect)
        else:
            page_rings.append(rect)
        ratio = max(rect.width, rect.height) / min(rect.width, rect.height)
        if ratio > 1.01:
            issues.append(f'page {index + 1}: ellipse {rect.width:.3f} x {rect.height:.3f} pt')
    for target in targets or []:
        nearby_rings = [r for r in page_rings if
            abs((r.x0 + r.x1) / 2 - target['x']) < 1.5 and
            abs((r.y0 + r.y1) / 2 - target['y']) < 1.5]
        nearby_dots = [r for r in page_dots if
            abs((r.x0 + r.x1) / 2 - target['x']) < 1.5 and
            abs((r.y0 + r.y1) / 2 - target['y']) < 1.5]
        if len(nearby_rings) != 1 or len(nearby_dots) != int(target['checked']):
            issues.append(f'page {index + 1}: radio at {target["x"]:.2f},{target["y"]:.2f} lacks its expected ring/dot vectors')
    for dot in page_dots:
        centered = any(
            abs((ring.x0 + ring.x1) - (dot.x0 + dot.x1)) < 0.15
            and abs((ring.y0 + ring.y1) - (dot.y0 + dot.y1)) < 0.15
            and 0.3 < dot.width / ring.width < 0.8
            for ring in page_rings
        )
        if not centered:
            issues.append(f'page {index + 1}: selected dot has no concentric outer ring')
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                # A unique alphabetic probe avoids accidental matches to template
                # years, monetary zeros, line numbers or statutory percentages.
                if args.token in ''.join(span['text'].split()):
                    value_spans.append({'page': index + 1, 'text': span['text'], 'size': span['size']})
                    if abs(span['size'] - args.font_size) > 0.025:
                        issues.append(f"page {index + 1}: input font {span['size']:.3f} pt, expected {args.font_size:.3f}")
if not value_spans:
    issues.append(f'input text probe {args.token!r} absent from actual PDF')
if args.reference:
    reference = fitz.open(args.reference)
    if len(reference) != len(doc):
        issues.append('disabling value clipping changed pagination')
    else:
        for index, (page, expected) in enumerate(zip(doc, reference)):
            # The only changed CSS is overflow on selected value spans. Exact
            # raster equality establishes that no glyph ink was clipped, even
            # when PDF text extraction still reports the hidden characters.
            actual_pixels = page.get_pixmap(matrix=fitz.Matrix(3, 3), alpha=False)
            expected_pixels = expected.get_pixmap(matrix=fitz.Matrix(3, 3), alpha=False)
            if actual_pixels.samples != expected_pixels.samples:
                issues.append(f'page {index + 1}: value glyph ink differs from unclipped reference')
print(json.dumps({'pages': len(doc), 'circles': circles, 'dots': dots, 'valueSpans': value_spans, 'issues': issues}))
