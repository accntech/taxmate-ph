<script lang="ts">
	let { values }: { values: Record<string, string> } = $props();
	function fieldValue(id: string) { return values[id] || ''; }
	function moneyValue(id: string) { return values[id] || '0.00'; }
	function isQuarter(quarter: string) { return values['frm1601EQ:optQuarter'] === quarter; }
	function isCategory(category: string) { return values['frm1601EQ:optCategory'] === category; }
	function isOption(id: string, value: string) { return values[id] === value; }
</script>

			<article
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
														<td class="legacy-bcs-cell legacy-text-mark">
															eBIRForms compatible
														</td>
														<td class="legacy-logo-cell legacy-text-mark">
															Local print preview
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
															<span class={['legacy-radio', isQuarter('Q1') && 'legacy-radio-selected']}>
																{#if isQuarter('Q1')}<span class="legacy-radio-dot">●</span>{/if}
															</span>
															<span>1ST</span>
															<span class={['legacy-radio', isQuarter('Q2') && 'legacy-radio-selected']}>
																{#if isQuarter('Q2')}<span class="legacy-radio-dot">●</span>{/if}
															</span>
															<span>2ND</span>
															<span class={['legacy-radio', isQuarter('Q3') && 'legacy-radio-selected']}>
																{#if isQuarter('Q3')}<span class="legacy-radio-dot">●</span>{/if}
															</span>
															<span>3RD</span>
															<span class={['legacy-radio', isQuarter('Q4') && 'legacy-radio-selected']}>
																{#if isQuarter('Q4')}<span class="legacy-radio-dot">●</span>{/if}
															</span>
															<span>4TH</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-amended">
														<div class="legacy-label">
															<b>3</b>
															<span>Amended Return?</span>
														</div>
														<div class="legacy-box-row legacy-centered">
															<span
																class={[
																	'legacy-radio',
																	isOption('frm1601EQ:optAmendedReturn', 'Y') &&
																		'legacy-radio-selected'
																]}
															>
																{#if isOption('frm1601EQ:optAmendedReturn', 'Y')}
																	<span class="legacy-radio-dot">●</span>
																{/if}
															</span><span>Yes</span>
															<span
																class={[
																	'legacy-radio',
																	isOption('frm1601EQ:optAmendedReturn', 'N') &&
																		'legacy-radio-selected'
																]}
															>
																{#if isOption('frm1601EQ:optAmendedReturn', 'N')}
																	<span class="legacy-radio-dot">●</span>
																{/if}
															</span><span>No</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-withheld">
														<div class="legacy-label">
															<b>4</b>
															<span>Any Taxes Withheld?</span>
														</div>
														<div class="legacy-box-row legacy-centered">
															<span
																class={[
																	'legacy-radio',
																	isOption('frm1601EQ:optTaxesWithheld', 'Y') &&
																		'legacy-radio-selected'
																]}
															>
																{#if isOption('frm1601EQ:optTaxesWithheld', 'Y')}
																	<span class="legacy-radio-dot">●</span>
																{/if}
															</span><span>Yes</span>
															<span
																class={[
																	'legacy-radio',
																	isOption('frm1601EQ:optTaxesWithheld', 'N') &&
																		'legacy-radio-selected'
																]}
															>
																{#if isOption('frm1601EQ:optTaxesWithheld', 'N')}
																	<span class="legacy-radio-dot">●</span>
																{/if}
															</span><span>No</span>
														</div>
													</td>
													<td class="tblFormTd legacy-item legacy-sheets">
														<div class="legacy-label">
															<b>5</b>
															<span>No. of Sheet/s Attached</span>
														</div>
														<input
															class="legacy-right legacy-input legacy-short"
															readonly
															value={fieldValue('frm1601EQ:txtSheetsAttached') || '0'}
														/>
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
														>
															{#if isCategory('P')}<span class="legacy-radio-dot">●</span>{/if}
														</span>
														<span>Private</span>
														<span
															class={[
																'legacy-radio',
																isCategory('G') && 'legacy-radio-selected'
															]}
														>
															{#if isCategory('G')}<span class="legacy-radio-dot">●</span>{/if}
														</span>
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
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtTotalTaxesWithheld')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">20</td>
													<td>Less: Remittances Made: 1<sup>st</sup> Month of the Quarter</td>
													<td class="legacy-mirror-number">20</td>
													<td>
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtRemittanceFirstMonth')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">21</td>
													<td><span class="legacy-indent">2<sup>nd</sup> Month of the Quarter</span></td>
													<td class="legacy-mirror-number">21</td>
													<td>
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtRemittanceSecondMonth')}
														/>
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
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtTaxRemittedPreviousReturn')}
														/>
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
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtOverremittancePreviousQuarter')}
														/>
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
															value={moneyValue('frm1601EQ:txtTotalRemittances')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number">25</td>
													<td><b>Tax Still Due</b>/(Over-remittance) <i>(Item 19 less Item 24)</i></td>
													<td class="legacy-mirror-number">25</td>
													<td>
														<input
															class="legacy-input legacy-money legacy-disabled"
															readonly
															value={moneyValue('frm1601EQ:txtTaxStillDue')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td>Add: Penalties <b>26</b> Surcharge</td>
													<td class="legacy-mirror-number">26</td>
													<td>
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtSurcharge')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td><span class="legacy-indent-penalty"><b>27</b> Interest</span></td>
													<td class="legacy-mirror-number">27</td>
													<td>
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtInterest')}
														/>
													</td>
												</tr>
												<tr>
													<td class="legacy-line-number"></td>
													<td><span class="legacy-indent-penalty"><b>28</b> Compromise</span></td>
													<td class="legacy-mirror-number">28</td>
													<td>
														<input
															class="legacy-input legacy-money"
															readonly
															value={moneyValue('frm1601EQ:txtCompromise')}
														/>
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
															value={moneyValue('frm1601EQ:txtTotalPenalties')}
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
														<input
															class="legacy-input legacy-money legacy-disabled"
															readonly
															value={moneyValue('frm1601EQ:txtTotalAmountDue')}
														/>
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
															class="legacy-right legacy-input legacy-payment-input"
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
															class="legacy-right legacy-input legacy-payment-input"
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
															class="legacy-right legacy-input legacy-payment-input"
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
															class="legacy-right legacy-input legacy-payment-input"
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
								<tr>
									<td>
										<table class="tblForm legacy-note" cellspacing="0" cellpadding="0">
											<tbody>
												<tr>
													<td class="tblFormTd">
														NOTE: *Please read the BIR Data Privacy Policy found in the BIR website
														(www.bir.gov.ph)
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
