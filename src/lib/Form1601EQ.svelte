<script lang="ts">
	import { tick } from 'svelte';
	import type { FormDefinition } from './forms';

	type Props = {
		definition: FormDefinition;
		values: Record<string, string>;
	};

	let { definition, values = $bindable() }: Props = $props();
	let isPrintPreview = $state(false);
	let printPreviewElement: HTMLElement | undefined = $state();

	let returnPeriod = $derived(
		`${values['frm1601EQ:txtYear'] || 'YYYY'} ${values['frm1601EQ:optQuarter'] || 'Q'}`
	);
	let taxDue = $derived(values['frm1601EQ:txtTaxDue'] || '0.00');

	function updateField(id: string, value: string) {
		values[id] = value;
	}

	function fieldValue(id: string) {
		return values[id] || '';
	}

	function isQuarter(quarter: string) {
		return values['frm1601EQ:optQuarter'] === quarter;
	}

	function isCategory(category: string) {
		return values['frm1601EQ:optCategory'] === category;
	}

	function cancelPrintPreview() {
		isPrintPreview = false;
	}

	async function printCurrentForm() {
		isPrintPreview = true;
		await tick();

		if (printPreviewElement) {
			await waitForImages(printPreviewElement);
		}

		window.print();
	}

	async function waitForImages(element: HTMLElement) {
		const images = Array.from(element.querySelectorAll('img'));

		await Promise.all(
			images.map((image) => {
				if (image.complete) {
					return Promise.resolve();
				}

				return new Promise<void>((resolve) => {
					image.addEventListener('load', () => resolve(), { once: true });
					image.addEventListener('error', () => resolve(), { once: true });
				});
			})
		);
	}
</script>

<section class={['grid gap-4', isPrintPreview && 'print-preview-active']}>
	<div class="form-toolbar flex items-start justify-between gap-4 border-b border-line-soft pb-3">
		<div>
			<h2 class="text-lg font-semibold text-text-main">BIR Form {definition.code}</h2>
			<p class="text-sm text-text-muted">{definition.title}</p>
		</div>
		<div class="flex flex-wrap justify-end gap-2">
			{#if isPrintPreview}
				<button class="codex-button" type="button" onclick={cancelPrintPreview}>Close Preview</button>
				<button class="codex-button-primary" type="button" onclick={printCurrentForm}>
					Print / Save PDF
				</button>
			{:else}
				<button class="codex-button-primary" type="button" onclick={printCurrentForm}>
					Print / Save PDF
				</button>
			{/if}
		</div>
	</div>

	{#if isPrintPreview}
		<div
			class="preview-notice grid gap-3 rounded-sm border border-bir-gold/40 bg-bir-gold/10
				p-3 text-sm text-text-main"
		>
			<p class="font-semibold">This form prints as an A4 page.</p>
			<p class="text-text-muted">
				Choose your printer or Save as PDF in the system print dialog.
			</p>
		</div>

		<article
			bind:this={printPreviewElement}
			class="legacy-container"
			aria-label="BIR Form 1601EQ print preview"
		>
			<div class="legacy-wrapper">
				<div class="legacy-bg-strip">
					<div class="legacy-form-paper">
						<table class="legacy-root-table" cellspacing="0" cellpadding="0">
							<tbody>
								<tr>
									<td>
										<table class="legacy-top-header" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="legacy-bcs-cell">
														<img alt="BIR BCS" src="/legacy/img/bcs_new.png" />
													</td>
													<td class="legacy-logo-cell">
														<img alt="Bureau of Internal Revenue" src="/legacy/img/header_logo.png" />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="legacy-form-header" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="legacy-form-number">
														<p>BIR Form No.</p>
														<strong>1601-EQ</strong>
														<p>January 2018</p>
														<p><b>Page 1</b></p>
													</td>
													<td class="legacy-form-title">
														<h3>Quarterly Remittance Return</h3>
														<h4>of Creditable Income Taxes Withheld (Expanded)</h4>
														<p>
															<i>
																Enter all required information in CAPITAL LETTERS using BLACK ink.
																Mark all applicable boxes with an "X".
															</i>
														</p>
													</td>
													<td class="legacy-barcode-cell">
														<img
															alt="1601EQ barcode"
															src="/legacy/img/1601EQ_BarCode/1601EQ_p1.png"
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-info-row" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-item legacy-year">
														<div class="legacy-label">
															<b>1</b>
															<span>For the Year</span>
														</div>
														<input
															class="legacy-input legacy-short"
															readonly
															value={fieldValue('frm1601EQ:txtYear')}
														/>
													</td>
													<td class="tblFormTd legacy-item legacy-quarter">
														<div class="legacy-label">
															<b>2</b>
															<span>Quarter</span>
														</div>
														<div class="legacy-box-row">
															<span class={['legacy-radio', isQuarter('Q1') && 'legacy-radio-selected']}></span>
															<span>1ST</span>
															<span class={['legacy-radio', isQuarter('Q2') && 'legacy-radio-selected']}></span>
															<span>2ND</span>
															<span class={['legacy-radio', isQuarter('Q3') && 'legacy-radio-selected']}></span>
															<span>3RD</span>
															<span class={['legacy-radio', isQuarter('Q4') && 'legacy-radio-selected']}></span>
															<span>4TH</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-amended">
														<div class="legacy-label">
															<b>3</b>
															<span>Amended Return?</span>
														</div>
														<div class="legacy-box-row legacy-centered">
															<span class="legacy-radio"></span><span>Yes</span>
															<span class="legacy-radio legacy-radio-selected"></span><span>No</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-withheld">
														<div class="legacy-label">
															<b>4</b>
															<span>Any Taxes Withheld?</span>
														</div>
														<div class="legacy-box-row legacy-centered">
															<span class="legacy-radio legacy-radio-selected"></span><span>Yes</span>
															<span class="legacy-radio"></span><span>No</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-sheets">
														<div class="legacy-label">
															<b>5</b>
															<span>No. of Sheet/s Attached</span>
														</div>
														<input class="legacy-input legacy-short legacy-right" readonly value="0" />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-tin-row" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-tin-cell">
														<b>6</b>
														<span>Taxpayer Identification Number (TIN)</span>
														<input
															class="legacy-input legacy-tin-part"
															readonly
															value={fieldValue('frm1601EQ:txtTIN1')}
														/>
														<input
															class="legacy-input legacy-tin-part"
															readonly
															value={fieldValue('frm1601EQ:txtTIN2')}
														/>
														<input
															class="legacy-input legacy-tin-part"
															readonly
															value={fieldValue('frm1601EQ:txtTIN3')}
														/>
														<input
															class="legacy-input legacy-branch"
															readonly
															value={fieldValue('frm1601EQ:txtBranchCode')}
														/>
													</td>
													<td class="tblFormTd legacy-rdo-cell">
														<b>7</b>
														<span>RDO Code</span>
														<span class="legacy-label-value">
															{fieldValue('frm1601EQ:txtRDOCode') || '\u00a0'}
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-full-row" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-name-cell">
														<div class="legacy-label">
															<b>8</b>
															<span>
																Withholding Agent's Name
																<i>
																	(Last Name, First Name, Middle Name for Individual OR
																	Registered Name for Non-Individual)
																</i>
															</span>
														</div>
														<input
															class="legacy-input legacy-name-input"
															readonly
															value={fieldValue('frm1601EQ:txtTaxpayerName')}
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-address" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-address-cell" colspan="2">
														<div class="legacy-label">
															<b>9</b>
															<span>
																Registered Address
																<i>
																	(Indicate complete address. If branch, indicate the
																	branch address.)
																</i>
															</span>
														</div>
														<input
															class="legacy-input legacy-address-input"
															readonly
															value={fieldValue('frm1601EQ:txtAddress')}
														/>
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-address-line">
														<input
															class="legacy-input legacy-address-input legacy-address-second"
															readonly
															value={fieldValue('frm1601EQ:txtAddress2')}
														/>
													</td>
													<td class="tblFormTd legacy-zip-cell">
														<b>9A</b>
														<span>ZIP Code</span>
														<input
															class="legacy-input legacy-zip-input"
															readonly
															value={fieldValue('frm1601EQ:txtZipCode')}
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-contact" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-contact-number">
														<b>10</b>
														<span>Contact Number</span>
														<input
															class="legacy-input legacy-contact-input"
															readonly
															value={fieldValue('frm1601EQ:txtTelNum')}
														/>
													</td>
													<td class="tblFormTd legacy-category">
														<b>11</b>
														<span>Category of Withholding Agent</span>
														<span
															class={[
																'legacy-radio',
																isCategory('P') && 'legacy-radio-selected'
															]}
														></span>
														<span>Private</span>
														<span
															class={[
																'legacy-radio',
																isCategory('G') && 'legacy-radio-selected'
															]}
														></span>
														<span>Government</span>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-full-row" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-email-cell">
														<b>12</b>
														<span>Email Address</span>
														<input
															class="legacy-input legacy-email-input"
															readonly
															value={fieldValue('txtEmail')}
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-atc" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTdPart legacy-part-title" colspan="5">
														Part II - Computation of Tax
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-atc-number"></td>
													<td class="tblFormTd legacy-atc-heading">ATC</td>
													<td class="tblFormTd legacy-atc-heading">
														Tax base <i>(Consolidated for the Quarter)</i>
													</td>
													<td class="tblFormTd legacy-atc-heading">Tax Rate</td>
													<td class="tblFormTd legacy-atc-heading">
														Tax Withheld <i>(Consolidated for the Quarter)</i>
													</td>
												</tr>
												{#each [13, 14, 15, 16, 17, 18] as line (line)}
													<tr>
														<td class="tblFormTd legacy-atc-number">{line}</td>
														<td class="tblFormTd">
															<input
																class="legacy-input legacy-atc-code"
																readonly
																value={fieldValue(`frm1601EQ:txtATC${line}`)}
															/>
														</td>
														<td class="tblFormTd">
															<input
																class="legacy-input legacy-atc-money"
																readonly
																value={fieldValue(`frm1601EQ:txtTaxBase${line}`)}
															/>
														</td>
														<td class="tblFormTd">
															<input
																class="legacy-input legacy-atc-rate"
																readonly
																value={fieldValue(`frm1601EQ:txtTaxRate${line}`)}
															/>
														</td>
														<td class="tblFormTd">
															<input
																class="legacy-input legacy-atc-money"
																readonly
																value={fieldValue(`frm1601EQ:txtTaxWithheld${line}`)}
															/>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-remittance" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="legacy-line-number">19</td>
													<td>Total Taxes Withheld for the Quarter <i>(Sum of Items 13 to 18)</i></td>
													<td class="legacy-mirror-number">19</td>
													<td>
														<input class="legacy-input legacy-money" readonly value={taxDue} />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">20</td>
													<td>Less: Remittances Made: 1<sup>st</sup> Month of the Quarter</td>
													<td class="legacy-mirror-number">20</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">21</td>
													<td><span class="legacy-indent">2<sup>nd</sup> Month of the Quarter</span></td>
													<td class="legacy-mirror-number">21</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">22</td>
													<td>
														<span class="legacy-indent-small">
															Tax Remitted in Return Previously Filed, if this is an amended return
														</span>
													</td>
													<td class="legacy-mirror-number">22</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">23</td>
													<td>
														<span class="legacy-indent-small">
															Over-remittance from Previous Quarter of the same taxable year
														</span>
													</td>
													<td class="legacy-mirror-number">23</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">24</td>
													<td>Total Remittances Made <i>(Sum of Items 20 to 23)</i></td>
													<td class="legacy-mirror-number">24</td>
													<td>
														<input
															class="legacy-input legacy-money legacy-disabled"
															readonly
															value="0.00"
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">25</td>
													<td><b>Tax Still Due</b>/(Over-remittance) <i>(Item 19 less Item 24)</i></td>
													<td class="legacy-mirror-number">25</td>
													<td>
														<input class="legacy-input legacy-money legacy-disabled" readonly value={taxDue} />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td>Add: Penalties <b>26</b> Surcharge</td>
													<td class="legacy-mirror-number">26</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td><span class="legacy-indent-penalty"><b>27</b> Interest</span></td>
													<td class="legacy-mirror-number">27</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td><span class="legacy-indent-penalty"><b>28</b> Compromise</span></td>
													<td class="legacy-mirror-number">28</td>
													<td>
														<input class="legacy-input legacy-money" readonly value="0.00" />
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">29</td>
													<td>Total Penalties <i>(Sum of Items 26 to 28)</i></td>
													<td class="legacy-mirror-number">29</td>
													<td>
														<input
															class="legacy-input legacy-money legacy-disabled"
															readonly
															value="0.00"
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">30</td>
													<td>
														<b>TOTAL AMOUNT STILL DUE</b>/(Over-remittance)
														<i>(Sum of Items 25 and 29)</i>
													</td>
													<td class="legacy-mirror-number">30</td>
													<td>
														<input class="legacy-input legacy-money legacy-disabled" readonly value={taxDue} />
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-certification" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd">
														<p>
															I declare, under the penalties of perjury, that this return has been
															made in good faith, verified by me, and is true and correct.
														</p>
														<div class="legacy-signatures">
															<div>
																<span></span>
																<p>Taxpayer / Authorized representative</p>
															</div>
															<div>
																<span></span>
																<p>Date signed</p>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-payment" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTdPart legacy-part-title" colspan="5">
														Part III - Details of Payment
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-payment-heading">Particulars</td>
													<td class="tblFormTd legacy-payment-heading">Drawee Bank/Agency</td>
													<td class="tblFormTd legacy-payment-heading">Number</td>
													<td class="tblFormTd legacy-payment-heading">Date (MM/DD/YYYY)</td>
													<td class="tblFormTd legacy-payment-heading">Amount</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-payment-particular">
														<b>31</b>
														<span>Cash/Bank Debit Memo</span>
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input
															class="legacy-input legacy-payment-input legacy-right"
															readonly
														/>
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-payment-particular">
														<b>32</b>
														<span>Check</span>
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input
															class="legacy-input legacy-payment-input legacy-right"
															readonly
														/>
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-payment-particular">
														<b>33</b>
														<span>Tax Debit Memo</span>
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input
															class="legacy-input legacy-payment-input legacy-right"
															readonly
														/>
													</td>
												</tr>
												<tr>
													<td class="tblFormTd legacy-payment-particular" colspan="5">
														<b>34</b>
														<span>Others <i>(specify below)</i></span>
													</td>
												</tr>
												<tr>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input class="legacy-input legacy-payment-input" readonly />
													</td>
													<td class="tblFormTd">
														<input
															class="legacy-input legacy-payment-input legacy-right"
															readonly
														/>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<table class="tblForm legacy-validation" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd legacy-validation-details">
														Machine Validation/Revenue Official Receipt Details
														<br />
														<i>(If not filed with an Authorized Agent Bank)</i>
													</td>
													<td class="tblFormTd legacy-validation-stamp">
														<i>
															Stamp of Receiving Office/AAB and Date of Receipt
															<br />
															(RO's Signature/Bank Teller's Initial)
														</i>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</article>
	{:else}
		<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
			{#each definition.fields as field (field.id)}
				<label class="codex-label">
					<span class="codex-label-text">
						{field.label}
						{#if field.required}
							<span class="text-bir-red">*</span>
						{/if}
					</span>

					{#if field.type === 'select'}
						<select
							class="codex-input"
							value={values[field.id] ?? ''}
							onchange={(event) => updateField(field.id, event.currentTarget.value)}
						>
							<option value="">Select</option>
							{#each field.options ?? [] as option (option)}
								<option value={option}>{option}</option>
							{/each}
						</select>
					{:else}
						<input
							class="codex-input"
							inputmode={field.type === 'number' ? 'decimal' : 'text'}
							type="text"
							value={values[field.id] ?? ''}
							oninput={(event) => updateField(field.id, event.currentTarget.value)}
						/>
					{/if}
				</label>
			{/each}
		</div>
	{/if}
</section>

<style>
	.legacy-container {
		color: #000;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 12px;
		overflow-x: auto;
	}

	.legacy-wrapper {
		width: 836px;
		margin: 0 auto;
		position: relative;
	}

	.legacy-bg-strip {
		background-image: url('/legacy/img/frmbg.png');
		background-position: top;
		background-repeat: repeat-x;
		padding: 1%;
	}

	.legacy-form-paper {
		width: 830px;
		margin: 0 auto;
		border: #ccc 1px solid;
		background: #fff;
	}

	.legacy-root-table,
	.legacy-top-header,
	.legacy-form-header,
	.tblForm {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
	}

	.legacy-top-header {
		height: 55px;
	}

	.legacy-bcs-cell {
		width: 300px;
		vertical-align: bottom;
	}

	.legacy-bcs-cell img {
		width: 80px;
		height: 25px;
	}

	.legacy-logo-cell {
		text-align: left;
		vertical-align: middle;
	}

	.legacy-logo-cell img {
		width: 210px;
		height: 50px;
	}

	.legacy-form-header {
		height: 90px;
		border: 2px solid #000;
	}

	.legacy-form-number {
		width: 145px;
		text-align: center;
		vertical-align: middle;
	}

	.legacy-form-number p,
	.legacy-form-title p,
	.legacy-form-title h3,
	.legacy-form-title h4 {
		margin: 0;
	}

	.legacy-form-number p {
		font-size: 10px;
		line-height: 1.15;
	}

	.legacy-form-number strong {
		display: block;
		font-size: 32px;
		line-height: 1;
	}

	.legacy-form-title {
		width: 475px;
		text-align: center;
	}

	.legacy-form-title h3 {
		font-size: 24px;
		font-weight: 700;
	}

	.legacy-form-title h4 {
		font-size: 16px;
		font-weight: 700;
	}

	.legacy-form-title p {
		font-size: 10px;
		line-height: 1.2;
	}

	.legacy-barcode-cell {
		width: 210px;
		vertical-align: top;
	}

	.legacy-barcode-cell img {
		width: 210px;
		height: auto;
		max-width: none;
	}

	.tblForm {
		background: #e2e2e2;
	}

	.tblForm td.tblFormTd,
	.tblForm td.tblFormTdPart {
		background-image: url('/legacy/img/frmbg.png');
		background-position: top;
		background-repeat: repeat-x;
		border-top: #aaa 1px solid;
		border-right: #aaa 1px solid;
		padding: 1px 0;
	}

	.legacy-item {
		height: 58px;
		vertical-align: top;
	}

	.legacy-year {
		width: 90px;
	}

	.legacy-quarter {
		width: 230px;
	}

	.legacy-amended {
		width: 160px;
	}

	.legacy-withheld {
		width: 156px;
	}

	.legacy-sheets {
		width: 140px;
	}

	.legacy-label {
		display: flex;
		gap: 4px;
		align-items: baseline;
		font-size: 10px;
		line-height: 1.1;
	}

	.legacy-label b,
	.legacy-tin-cell b,
	.legacy-rdo-cell b,
	.legacy-line-number,
	.legacy-mirror-number {
		font-size: 14px;
		font-weight: 700;
	}

	.legacy-box-row {
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 7px 0 0 12px;
		font-size: 10px;
	}

	.legacy-centered {
		justify-content: center;
		margin-left: 0;
	}

	.legacy-radio {
		display: inline-block;
		position: relative;
		width: 10px;
		height: 10px;
		border: 1px solid #000;
		border-radius: 50%;
		background: #fff;
	}

	.legacy-radio-selected::after {
		content: '';
		position: absolute;
		inset: 2px;
		border-radius: 50%;
		background: #000;
	}

	.legacy-input {
		height: 14px;
		border: 1px inset #fff;
		background: #fff;
		color: #000 !important;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 12px;
		padding: 0 2px;
	}

	.legacy-short {
		width: 48px;
		margin: 7px 0 0 17px;
	}

	.legacy-right,
	.legacy-money {
		text-align: right;
	}

	.legacy-tin-cell {
		width: 600px;
		height: 34px;
		padding-left: 4px !important;
		vertical-align: middle;
	}

	.legacy-tin-cell span,
	.legacy-rdo-cell span {
		font-size: 10px;
	}

	.legacy-tin-part {
		width: 36px;
		margin-left: 4px;
		text-align: center;
	}

	.legacy-branch {
		width: 58px;
		margin-left: 4px;
		text-align: center;
	}

	.legacy-rdo-cell {
		width: 230px;
		padding-left: 4px !important;
		vertical-align: middle;
	}

	.legacy-label-value {
		display: inline-block;
		min-width: 42px;
		margin-left: 4px;
		border: 2px inset #fff;
		background: #fff;
		font-size: 12px !important;
		padding: 0 2px;
	}

	.legacy-name-cell {
		padding: 2px 0 4px !important;
	}

	.legacy-name-cell .legacy-label {
		margin-left: 4px;
	}

	.legacy-name-input {
		width: 790px;
		margin: 4px 0 0 20px;
	}

	.legacy-address-cell,
	.legacy-address-line,
	.legacy-email-cell {
		padding: 2px 0 4px !important;
	}

	.legacy-address-cell .legacy-label {
		margin-left: 4px;
	}

	.legacy-address-input {
		width: 790px;
		margin: 4px 0 0 20px;
	}

	.legacy-address-second {
		width: 560px;
	}

	.legacy-zip-cell {
		width: 180px;
		padding-left: 4px !important;
		font-size: 10px;
		vertical-align: middle;
	}

	.legacy-zip-cell b,
	.legacy-contact b,
	.legacy-email-cell b,
	.legacy-payment-particular b,
	.legacy-atc-number {
		font-size: 14px;
		font-weight: 700;
	}

	.legacy-zip-input {
		width: 72px;
		margin-left: 6px;
	}

	.legacy-contact-number,
	.legacy-category {
		width: 50%;
		height: 26px;
		padding-left: 4px !important;
		font-size: 10px;
		vertical-align: middle;
	}

	.legacy-contact-input {
		width: 190px;
		margin-left: 6px;
	}

	.legacy-category .legacy-radio {
		margin-left: 16px;
		vertical-align: -1px;
	}

	.legacy-email-cell {
		height: 28px;
		padding-left: 4px !important;
		font-size: 10px;
		vertical-align: middle;
	}

	.legacy-email-input {
		width: 660px;
		margin-left: 28px;
	}

	.legacy-part-title {
		height: 20px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
	}

	.legacy-atc td {
		font-size: 10px;
		padding: 2px 4px !important;
		text-align: center;
	}

	.legacy-atc-number {
		width: 38px;
		text-align: center;
	}

	.legacy-atc-heading {
		font-weight: 700;
	}

	.legacy-atc-code {
		width: 120px;
		text-align: center;
	}

	.legacy-atc-money {
		width: 190px;
		text-align: right;
	}

	.legacy-atc-rate {
		width: 120px;
		text-align: right;
	}

	.legacy-remittance td {
		border-top: #aaa 1px solid;
		border-right: #aaa 1px solid;
		font-size: 10px;
		padding: 2px 4px;
	}

	.legacy-remittance {
		table-layout: fixed;
	}

	.legacy-remittance .legacy-line-number {
		width: 38px;
		text-align: center;
	}

	.legacy-remittance td:nth-child(2) {
		width: 520px;
	}

	.legacy-remittance .legacy-mirror-number {
		width: 42px;
		text-align: center;
	}

	.legacy-remittance td:last-child {
		width: 210px;
		text-align: right;
	}

	.legacy-money {
		width: 150px;
	}

	.legacy-indent {
		display: inline-block;
		margin-left: 108px;
	}

	.legacy-indent-small {
		display: inline-block;
		margin-left: 24px;
	}

	.legacy-indent-penalty {
		display: inline-block;
		margin-left: 72px;
	}

	.legacy-disabled {
		background: rgb(220, 220, 220);
	}

	.legacy-certification td {
		padding: 10px 12px !important;
		font-size: 10px;
	}

	.legacy-certification p {
		margin: 0;
	}

	.legacy-signatures {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		margin-top: 34px;
		text-align: center;
	}

	.legacy-signatures span {
		display: block;
		border-top: 1px solid #000;
	}

	.legacy-payment td {
		border-top: #aaa 1px solid;
		border-right: #aaa 1px solid;
		font-size: 10px;
		padding: 2px 4px !important;
	}

	.legacy-payment-heading {
		text-align: center;
		font-weight: 700;
	}

	.legacy-payment-particular {
		width: 180px;
	}

	.legacy-payment-particular b {
		margin-right: 10px;
	}

	.legacy-payment-input {
		width: 140px;
	}

	.legacy-validation td {
		height: 82px;
		border: #aaa 1px solid;
		font-size: 10px;
		padding: 4px 6px !important;
		vertical-align: top;
	}

	.legacy-validation-details {
		width: 60%;
		text-align: left;
	}

	.legacy-validation-stamp {
		width: 40%;
		text-align: center;
	}

	@media print {
		@page {
			size: A4;
			margin: 8mm;
		}

		@page bir-a4 {
			size: A4;
			margin: 8mm;
		}

		:global(html) {
			width: auto;
			height: auto;
			margin: 0;
			padding: 0;
			overflow: hidden;
		}

		:global(body) {
			background: none !important;
			width: auto;
			height: auto;
			margin: 0;
			padding: 0;
			overflow: hidden;
		}

		:global(body *) {
			visibility: hidden;
		}

		.print-preview-active {
			position: fixed;
			inset: 0;
			width: 0;
			height: 0;
			overflow: visible;
		}

		.legacy-container,
		.legacy-container * {
			visibility: visible;
		}

		.legacy-container {
			page: bir-a4;
			position: fixed;
			inset: 0;
			width: calc(210mm - 16mm);
			height: calc(297mm - 16mm);
			overflow: hidden;
			break-after: avoid;
			page-break-after: avoid;
		}

		.legacy-wrapper {
			zoom: 0.92;
		}

		.legacy-wrapper,
		.legacy-bg-strip,
		.legacy-form-paper {
			width: 8.3in;
			max-width: 8.3in;
			margin: 0;
			padding: 0;
			border: 0;
		}

		.legacy-form-paper {
			box-sizing: border-box;
			border-left: #aaa 1px solid;
			border-top: #aaa 1px solid;
		}

		.form-toolbar,
		.preview-notice {
			display: none !important;
		}
	}
</style>
