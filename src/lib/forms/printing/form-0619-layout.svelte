<script lang="ts">
  /** Static January 2018 form geometry. Values remain in the caller's original OCR bindings. */
  let { variant }: { variant: 'E' | 'F' } = $props();
  const finalTax = $derived(variant === 'F');
  type Box = { x: number; y: number; w: number; h: number; kind?: string };
  type TaxRow = { y: number; h: number; n: string; text: string; description?: string; size?: number; note?: string; indent?: boolean; total?: boolean };
  const geometry = $derived(finalTax ? {
    header: 123, grid: 274, gridBottom: 357, part1: 363, tin: 397, name: 449, nameBottom: 528,
    address: 528, address2: 608, contact: 658, email: 709, part1Bottom: 791,
    part2: 797, declaration: 1401, signature: 1465, signatureLabel: 1595, accreditation: 1670,
    part2Bottom: 1724, part3: 1732, payment: 1765, paymentRows: 1797, other: 1949, receipt: 2030,
    bottom: 2147, barcodeY: 139, barcodeH: 89, barcodeX: 1262, barcodeW: 384,
  } : {
    header: 157, grid: 331, gridBottom: 418, part1: 425, tin: 458, name: 510, nameBottom: 589,
    address: 589, address2: 669, contact: 719, email: 770, part1Bottom: 852,
    part2: 859, declaration: 1328, signature: 1392, signatureLabel: 1534, accreditation: 1609,
    part2Bottom: 1671, part3: 1678, payment: 1711, paymentRows: 1743, other: 1895, receipt: 1976,
    bottom: 2145, barcodeY: 179, barcodeH: 99, barcodeX: 1264, barcodeW: 379,
  });
  // Each row stores black bar runs of the original fixed PDF417 document identifier.
  // Only the barcode is vectorized; the form itself is selectable HTML text and CSS boxes.
  const barcodeRuns = {"E":[[[0,25],[28,3],[34,3],[40,4],[53,16],[72,3],[78,3],[84,16],[106,10],[119,3],[125,6],[135,12],[160,3],[175,7],[185,9],[200,7],[213,16],[232,6],[241,3],[251,12],[266,16],[285,3],[291,3],[298,15],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,16],[72,3],[78,3],[91,6],[106,13],[125,3],[135,3],[150,3],[160,9],[185,3],[197,7],[207,3],[213,6],[235,3],[241,10],[254,3],[266,13],[282,3],[288,3],[298,3],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,3],[59,3],[66,3],[75,13],[106,10],[119,3],[125,3],[131,19],[160,6],[172,10],[191,3],[197,10],[213,3],[222,4],[238,3],[244,13],[266,7],[276,3],[282,3],[294,16],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,6],[62,4],[69,12],[88,15],[106,7],[122,9],[135,6],[150,3],[160,3],[178,4],[188,6],[204,6],[213,3],[229,6],[244,7],[257,3],[266,7],[276,3],[282,13],[301,15],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,6],[62,4],[69,9],[91,3],[106,4],[113,18],[135,3],[141,6],[160,3],[166,6],[175,19],[200,7],[213,3],[222,10],[238,3],[244,16],[266,13],[282,3],[288,10],[304,9],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,16],[72,3],[78,13],[94,6],[106,3],[113,3],[119,3],[138,12],[160,6],[169,19],[191,6],[207,3],[213,3],[225,4],[235,6],[247,16],[266,13],[282,3],[288,13],[313,3],[320,22],[345,3],[357,3],[363,4],[373,3]],[[0,25],[28,3],[34,3],[40,4],[53,9],[66,3],[75,9],[88,15],[106,7],[116,6],[131,4],[150,3],[160,12],[175,10],[188,3],[200,7],[213,3],[219,10],[238,13],[257,6],[266,10],[279,3],[288,10],[301,15],[320,22],[345,3],[357,3],[363,4],[373,3]]],"F":[[[0,25],[28,3],[34,4],[41,3],[53,16],[72,4],[79,3],[85,16],[107,10],[120,3],[126,6],[136,12],[161,3],[177,6],[186,10],[202,6],[215,15],[234,6],[243,3],[253,12],[268,16],[287,3],[294,3],[300,16],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,16],[72,4],[79,3],[91,7],[107,13],[126,3],[136,3],[151,4],[161,9],[183,6],[196,9],[208,3],[215,6],[237,3],[243,10],[256,3],[268,13],[284,3],[290,4],[300,3],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,4],[60,3],[66,3],[76,12],[107,10],[120,3],[126,3],[132,19],[161,6],[174,9],[192,4],[199,9],[215,3],[224,3],[240,3],[246,13],[268,7],[278,3],[284,3],[297,16],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,7],[63,3],[69,13],[88,16],[107,7],[123,9],[136,6],[151,4],[161,3],[180,3],[189,7],[205,6],[215,3],[230,7],[246,7],[259,3],[268,7],[278,3],[284,13],[303,16],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,7],[63,3],[69,10],[91,4],[107,3],[113,19],[136,3],[142,6],[161,16],[180,6],[189,4],[196,3],[215,12],[234,6],[243,6],[262,3],[268,13],[284,3],[290,10],[306,10],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,16],[72,4],[79,12],[94,7],[107,3],[117,9],[129,3],[148,7],[161,3],[174,3],[183,3],[192,13],[215,9],[237,3],[243,16],[262,3],[268,13],[284,3],[290,13],[316,3],[322,22],[347,4],[360,3],[366,4],[376,3]],[[0,25],[28,3],[34,4],[41,3],[53,10],[66,3],[76,9],[88,16],[107,3],[113,4],[123,9],[142,9],[161,3],[170,7],[183,13],[199,9],[215,3],[230,7],[243,10],[256,6],[268,10],[281,3],[290,10],[303,16],[322,22],[347,4],[360,3],[366,4],[376,3]]]};
  const taxRows: TaxRow[] = $derived(finalTax ? [
    { y:862, h:53, n:'13', text:'WMF10', description:'Remittance of Final Income Taxes Withheld on Interest Paid on Deposits and Yield on Deposit Substitutes/Trusts/Etc.', size:23 },
    { y:915, h:50, n:'14', text:'WMF20', description:'Remittance of Final Income Taxes Withheld on Other Final Income Taxes', size:26 },
    { y:965, h:51, n:'15', text:'Total', note:'(Sum of Items 13 and 14)' },
    { y:1016, h:50, n:'16', text:'Less: Amount Remitted from Previously Filed Form, if this is an amended form' },
    { y:1066, h:51, n:'17', text:'Net Amount of Remittance', note:'(Item 15 Less Item 16)' },
    { y:1148, h:50, n:'18A', text:'Surcharge', indent:true },
    { y:1198, h:51, n:'18B', text:'Interest', indent:true },
    { y:1249, h:50, n:'18C', text:'Compromise', indent:true },
    { y:1299, h:51, n:'18D', text:'Total Penalties', note:'(Sum of Items 18A to 18C)', indent:true },
    { y:1350, h:51, n:'19', text:'Total Amount of Remittance', note:'(Sum of Items 17 and 18D)' },
  ] : [
    { y:891, h:52, n:'14', text:'Amount of Remittance' },
    { y:943, h:51, n:'15', text:'Less: Amount Remitted from Previously Filed Form, if this is an amended form' },
    { y:994, h:51, n:'16', text:'Net Amount of Remittance', note:'(Item 14 Less Item 15)' },
    { y:1075, h:51, n:'17A', text:'Surcharge', indent:true },
    { y:1126, h:50, n:'17B', text:'Interest', indent:true },
    { y:1176, h:51, n:'17C', text:'Compromise', indent:true },
    { y:1227, h:51, n:'17D', text:'Total Penalties', note:'(Sum of Items 17A to 17C)', indent:true },
    { y:1278, h:50, n:'18', text:'Total Amount of Remittance', note:'(Sum of Items 16 and 17D)', total:true },
  ]);
  const topColumns = $derived(finalTax ? [
    {x:48,w:397,n:'1',text:'For the month of',note:'(MM/YYYY)'},
    {x:445,w:401,n:'2',text:'Due Date',note:'(MM/DD/YYYY)'},
    {x:846,w:282,n:'3',text:'Amended Form?'},
    {x:1128,w:281,n:'4',text:'Any Taxes Withheld?'},
    {x:1409,w:241,n:'5',text:'Tax Type Code'},
  ] : [
    {x:48,w:356,n:'1',text:'For the Month of',note:'(MM/YYYY)'},
    {x:404,w:320,n:'2',text:'Due Date',note:'(MM/DD/YYYY)'},
    {x:724,w:282,n:'3',text:'Amended Form?'},
    {x:1006,w:281,n:'4',text:'Any Taxes Withheld?'},
    {x:1287,w:159,n:'5',text:'ATC'},
    {x:1446,w:204,n:'6',text:'Tax Type Code'},
  ]);
  const backgroundBoxes = $derived.by(() => {
    const g=geometry;
    const boxes: Box[] = [];
    const box=(x:number,y:number,w:number,h:number,kind='') => boxes.push({x,y,w,h,kind});
    box(48,g.header,1602,g.gridBottom-g.header,'outer');
    box(48,g.part1,1602,g.part1Bottom-g.part1,'outer');
    box(48,g.part2,1602,g.part2Bottom-g.part2,'outer');
    box(48,g.part3,1602,g.bottom-g.part3,'outer');
    box(48,g.part1,1602,g.tin-g.part1,'heading');
    box(48,g.part2,1602,finalTax?33:32,'heading');
    box(48,g.part3,1602,g.payment-g.part3,'heading');
    box(48,g.tin,558,52,'gray'); box(606,g.tin,683,52);
    for (const x of [725,886,1047]) box(x,g.tin,41,52,'gray');
    box(1289,g.tin,200,52,'gray'); box(1489,g.tin,120,52); box(1609,g.tin,41,52,'gray');
    box(48,g.name,1602,30,'gray'); box(48,g.name+30,1602,g.address-g.name-30);
    box(48,g.address,1602,31,'gray'); box(48,g.address+31,1602,g.address2-g.address-31);
    box(48,g.address2,1241,g.contact-g.address2); box(1289,g.address2,200,g.contact-g.address2,'gray'); box(1489,g.address2,161,g.contact-g.address2);
    box(48,g.contact,238,51,'gray'); box(286,g.contact,(finalTax?479:481),51);
    box(finalTax?765:767,g.contact,finalTax?885:883,51,'gray');
    box(48,g.email,1602,31,'gray');box(48,g.email+31,1602,g.part1Bottom-g.email-31);
    for(const row of taxRows) {
      box(48,row.y,1041,row.h,'gray');box(1089,row.y,440,row.h);box(1529,row.y,40,row.h,'gray');box(1569,row.y,81,row.h);
      if(row.description)box(48,row.y,161,row.h,'gray');
    }
    if(finalTax){box(48,830,161,32,'gray');box(209,830,880,32,'gray');box(1089,830,561,32,'gray');}
    box(48,finalTax?1117:1045,1602,finalTax?31:30,'gray');
    box(48,g.declaration,1602,g.signature-g.declaration,'gray');
    box(48,g.signature,841,g.signatureLabel-g.signature);box(889,g.signature,761,g.signatureLabel-g.signature);
    box(48,g.signatureLabel,841,g.accreditation-g.signatureLabel,'gray');box(889,g.signatureLabel,761,g.accreditation-g.signatureLabel,'gray');
    const accH=g.part2Bottom-g.accreditation;
    box(48,g.accreditation,318,accH,'gray');box(366,g.accreditation,402,accH);
    box(768,g.accreditation,201,accH,'gray');box(969,g.accreditation,242,accH);
    box(1211,g.accreditation,200,accH,'gray');box(1411,g.accreditation,239,accH);
    for(const [x,w] of [[48,278],[326,200],[526,241],[767,322],[1089,561]])box(x,g.payment,w,g.paymentRows-g.payment,'gray');
    for(let i=0;i<3;i++){
      const y=g.paymentRows+i*50.7;
      box(48,y,i===2?478:278,50.7,'gray');
      if(i!==2)box(326,y,200,50.7);
      box(526,y,241,50.7);box(767,y,322,50.7);box(1089,y,440,50.7);box(1529,y,40,50.7,'gray');box(1569,y,81,50.7);
    }
    box(48,g.other,1602,30,'gray');
    for(const [x,w] of [[48,278],[326,200],[526,241],[767,322],[1089,440],[1529,40],[1569,81]])box(x,g.other+30,w,g.receipt-g.other-30,x===1529?'gray':'');
    box(48,g.receipt,1041,g.bottom-g.receipt);box(1089,g.receipt,561,g.bottom-g.receipt);
    return boxes;
  });
  const rules = $derived.by(() => {
    const g=geometry;
    const lines:Box[]=[];
    const tick=(x:number,y:number,h=21,heavy=false)=>lines.push({x,y,w:heavy?4:0.7,h,kind:heavy?'heavy':''});
    for(let i=0;i<4;i++){
      const y=i<3?g.paymentRows+(i+1)*50.7-21:g.receipt-21;
      const first=i===2?566:i===3?88:365;
      for(let x=first;x<1650;x+=40){if(x>1529&&x<1569)continue;tick(x,y);}
      for(const x of [1169,1289,1409])tick(x,y,21,true);
    }
    return lines;
  });
  const labelNumber = $derived(finalTax ? 6 : 7);
</script>

<div class="remittance-template" data-html-form="0619{variant}" aria-label="BIR Form 0619{variant} printed layout">
  <div class="remittance-bcs" style:top={`${finalTax ? 65 : 92}px`}><span>For BIR<br />Use Only</span><span>BCS/<br />Item:</span></div>
  <img class="remittance-logo" src="/legacy/img/header_logo.png" alt="Republic of the Philippines, Department of Finance, Bureau of Internal Revenue" style:top={`${finalTax ? 45 : 72}px`} />
  {#each backgroundBoxes as box, index (index)}
    <div class="remittance-box {box.kind ?? ''}" style={`left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px`}></div>
  {/each}
  {#each rules as line, index (index)}
    <div class="remittance-tick" class:remittance-heavy={line.kind === 'heavy'} style={`left:${line.x}px;top:${line.y}px;width:${line.w}px;height:${line.h}px`}></div>
  {/each}
  <div class="remittance-form-number" style={`top:${geometry.header}px;height:${geometry.grid-geometry.header}px;width:${finalTax?237:241}px`}>
    <span>BIR Form No.</span><strong>0619-{variant}</strong><span>January 2018</span><b>Page 1</b>
  </div>
  <div class="remittance-title" style={`left:${finalTax?285:289}px;top:${geometry.header}px;width:${finalTax?962:960}px;height:${geometry.grid-geometry.header}px`}>
    <h1>Monthly Remittance Form</h1>
    <h2>{finalTax ? 'of Final Income Taxes Withheld' : 'of Creditable Income Taxes Withheld (Expanded)'}</h2>
    <p><span>Enter all required information in CAPITAL LETTERS using BLACK ink. Mark all applicable boxes with an “X”.</span><span>Two copies MUST be filed with the BIR and one held by the Taxpayer.</span></p>
  </div>
  <div class="remittance-barcode" role="img" aria-label="0619-{variant} 01/18 P1 document barcode" style={`left:${geometry.barcodeX}px;top:${geometry.barcodeY}px;width:${geometry.barcodeW}px;height:${geometry.barcodeH}px`}>
    {#each barcodeRuns[variant] as bars, row (row)}
      <div class="remittance-barcode-row">
        {#each bars as bar (bar[0])}<i style={`left:${bar[0]}px;width:${bar[1]}px`}></i>{/each}
      </div>
    {/each}
  </div>
  <div class="remittance-barcode-caption" style={`top:${geometry.barcodeY+geometry.barcodeH}px`}>0619-{variant} 01/18 P1</div>
  {#each topColumns as column (column.n)}
    <div class="remittance-top-column" style={`left:${column.x}px;top:${geometry.grid}px;width:${column.w}px;height:${geometry.gridBottom-geometry.grid}px`}>
      <div class="remittance-top-label"><b>{column.n}</b> {column.text} {#if column.note}<em>{column.note}</em>{/if}</div>
    </div>
  {/each}
  {#each (finalTax?[128,208,365,485,565,807]:[128,208,365,485,565]) as x (x)}
    <div class="remittance-top-line" style={`left:${x}px;top:${geometry.grid+31}px;height:${geometry.gridBottom-geometry.grid-31}px`}></div>
  {/each}
  {#each (finalTax?[{x:48,w:80},{x:365,w:80},{x:445,w:40},{x:807,w:39},{x:846,w:282},{x:1128,w:281},{x:1409,w:80},{x:1569,w:81}]:[{x:48,w:80},{x:365,w:39},{x:724,w:282},{x:1006,w:281},{x:1446,w:81},{x:1608,w:42}]) as fill (fill.x)}
    <div class="remittance-top-fill" style={`left:${fill.x}px;top:${geometry.grid+31}px;width:${fill.w}px;height:${geometry.gridBottom-geometry.grid-31}px`}></div>
  {/each}
  {#each (finalTax?[{x:887,label:'Yes'},{x:1008,label:'No'},{x:1169,label:'Yes'},{x:1290,label:'No'}]:[{x:765,label:'Yes'},{x:886,label:'No'},{x:1046,label:'Yes'},{x:1167,label:'No'}]) as check (check.x)}
    <div class="remittance-option" style={`left:${check.x}px;top:${geometry.grid+42}px`}><i></i><span>{check.label}</span></div>
  {/each}
  {#if !finalTax}
    <div class="remittance-constant" style={`left:1287px;top:${geometry.grid+31}px;width:159px`}>WME10</div>
    <div class="remittance-constant" style={`left:1527px;top:${geometry.grid+31}px;width:81px`}>WE</div>
  {/if}
  <h2 class="remittance-section-title" style={`top:${geometry.part1}px`}>Part I – Background Information</h2>
  <div class="remittance-label" style={`left:63px;top:${geometry.tin+12}px`}><b>{labelNumber}</b> Taxpayer Identification Number (TIN)</div>
  {#each [725,886,1047] as x (x)}<b class="remittance-hyphen" style={`left:${x}px;top:${geometry.tin+8}px`}>-</b>{/each}
  <div class="remittance-label" style={`left:1303px;top:${geometry.tin+12}px`}><b>{labelNumber+1}</b> RDO Code</div>
  <div class="remittance-label" style={`left:63px;top:${geometry.name+2}px`}><b>{labelNumber+2}</b> Withholding Agent’s Name <em>(Last Name, First Name, Middle Name for Individual OR Registered Name for Non-Individual)</em></div>
  <div class="remittance-label remittance-address" style={`left:60px;top:${geometry.address+2}px`}><b>{labelNumber+3}</b> Registered Address <em class="remittance-address-note">(Indicate complete address. If branch, indicate the branch address. If the registered address is different from the current address, go to the RDO to update registered address using BIR Form No. 1905)</em></div>
  <div class="remittance-label" style={`left:1303px;top:${geometry.address2+12}px`}><b>{labelNumber+3}A</b> ZIP Code</div>
  <div class="remittance-label" style={`left:60px;top:${geometry.contact+11}px`}><b>{labelNumber+4}</b> Contact Number</div>
  <div class="remittance-label" style={`left:${finalTax?780:782}px;top:${geometry.contact+11}px`}><b>{labelNumber+5}</b> Category of Withholding Agent</div>
  {#each (finalTax?[{x:1225,label:'Private'},{x:1421,label:'Government'}]:[{x:1237,label:'Private'},{x:1434,label:'Government'}]) as check (check.x)}
    <div class="remittance-option" style={`left:${check.x}px;top:${geometry.contact+10}px`}><i></i><span>{check.label}</span></div>
  {/each}
  <div class="remittance-label" style={`left:60px;top:${geometry.email+2}px`}><b>{labelNumber+6}</b> Email Address</div>
  <h2 class="remittance-section-title" style={`top:${geometry.part2}px`}>Part II – Tax Remittance</h2>
  {#if finalTax}
    <div class="remittance-tax-column" style="left:48px;top:830px;width:161px">ATC</div><div class="remittance-tax-column" style="left:209px;top:830px;width:880px">Description</div><div class="remittance-tax-column" style="left:1089px;top:830px;width:561px">Amount for Remittance</div>
  {/if}
  {#each taxRows as row (row.n)}
    <div class="remittance-tax-label" style={`left:${row.indent?(finalTax?140:154):63}px;top:${row.y}px;height:${row.h}px;width:${row.indent?940:1026}px`}>
      <b>{row.n}</b> <span class:remittance-total={row.total}>{row.text}</span> {#if row.note}<em>{row.note}</em>{/if}
    </div>
    {#if row.description}<div class="remittance-tax-description" style={`left:224px;top:${row.y}px;height:${row.h}px;font-size:${row.size}px`}>{row.description}</div>{/if}
    <div class="remittance-decimal" style={`top:${row.y}px;height:${row.h}px`}>.</div>
  {/each}
  <div class="remittance-label" style={`left:63px;top:${finalTax?1118:1046}px`}><b>{finalTax?'18':'17'}</b> Add: Penalties</div>
  <p class="remittance-declaration" style={`top:${geometry.declaration}px;height:${geometry.signature-geometry.declaration}px`}>I/We declare under the penalties of perjury that this remittance form has been made in good faith, verified by me/us, and to the best of my/our knowledge and belief, is true and correct, pursuant to the provisions of the National Internal Revenue Code, as amended, and the regulations issued under authority thereof. Further, I/we give my/our consent to the processing of my/our information as contemplated under the Data Privacy Act of 2012 (R.A. No. 10173) for legitimate and lawful purposes. <em>(If Authorized Representative, attach authorization letter)</em></p>
  <div class="remittance-signature-heading" style={`left:63px;top:${geometry.signature}px`}>For Individual:</div><div class="remittance-signature-heading" style={`left:903px;top:${geometry.signature}px`}>For Non-Individual:</div>
  <div class="remittance-signature-label" style={`left:48px;top:${geometry.signatureLabel}px;width:841px`}>Signature over Printed Name of Taxpayer/Authorized Representative/ Tax Agent<br /><em>(Indicate Title/Designation and TIN)</em></div>
  <div class="remittance-signature-label" style={`left:889px;top:${geometry.signatureLabel}px;width:761px`}>Signature over Printed Name of President/Vice President/<br />Authorized Officer or Representative/Tax Agent<br /><em>(Indicate Title/Designation and TIN)</em></div>
  <div class="remittance-accreditation" style={`left:48px;top:${geometry.accreditation}px;width:318px`}>Tax Agent Accreditation No./<br />Attorney’s Roll No. <em>(if applicable)</em></div>
  <div class="remittance-accreditation remittance-centered" style={`left:768px;top:${geometry.accreditation}px;width:201px`}>Date of Issue<br /><em>(MM/DD/YYYY)</em></div>
  <div class="remittance-accreditation remittance-centered" style={`left:1211px;top:${geometry.accreditation}px;width:200px`}>Date of Expiry<br /><em>(MM/DD/YYYY)</em></div>
  <h2 class="remittance-section-title" style={`top:${geometry.part3}px`}>Part III – Details of Payment</h2>
  {#each [{x:48,w:278,text:'Particulars'},{x:326,w:200,text:'Drawee Bank/Agency'},{x:526,w:241,text:'Number'},{x:767,w:322,text:'Date (MM/DD/YYYY)'},{x:1089,w:561,text:'Amount'}] as cell (cell.x)}
    <div class="remittance-payment-heading" class:remittance-bank-heading={cell.x === 326} style={`left:${cell.x}px;top:${geometry.payment}px;width:${cell.w}px`}>{cell.text}</div>
  {/each}
  {#each ['Cash/Bank Debit Memo','Check','Tax Debit Memo'] as label, index (label)}
    <div class="remittance-payment-label" class:remittance-bank-payment={index === 0} style={`top:${geometry.paymentRows+index*50.7}px`}><b>{finalTax?20+index:19+index}</b> {label}</div>
    <div class="remittance-decimal" style={`top:${geometry.paymentRows+index*50.7}px;height:50.7px`}>.</div>
  {/each}
  <div class="remittance-label" style={`left:63px;top:${geometry.other+2}px`}><b>{finalTax?'23':'22'}</b> Others <em>(specify below)</em></div>
  <div class="remittance-decimal" style={`top:${geometry.other+30}px;height:${geometry.receipt-geometry.other-30}px`}>.</div>
  <div class="remittance-receipt-label" style={`left:63px;top:${geometry.receipt+4}px;width:1011px`}>Machine Validation/Revenue Official Receipt Details <em>(if not filed with an Authorized Agent Bank)</em></div>
  <div class="remittance-receipt-label remittance-centered" style={`left:1089px;top:${geometry.receipt+4}px;width:561px` }><em>Stamp of Receiving Office/AAB and Date of Receipt<br />(RO’s Signature/Bank Teller’s Initial)</em></div>
  <div class="remittance-note" style={`top:${geometry.bottom+2}px`}><b>NOTE: *</b>Please read the BIR Data Privacy Policy found in the BIR website (www.bir.gov.ph)</div>
</div>
