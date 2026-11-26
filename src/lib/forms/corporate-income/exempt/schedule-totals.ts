// Schedule dependencies from the June 2013 HTA Compute_* handlers, in calculation order.
export const legacyScheduleTotals = [
	{
		outputs: ['txtPg3S1I4Total'],
		inputs: [
			'txtPg3S1I1GoodsProp',
			'txtPg3S1I2SaleServices',
			'txtPg3S1I3LeaseProp',
		]
	},
	{
		outputs: ['txtPg2Pt4I31NetSales', 'txtPg3S1I6NetSales'],
		inputs: [
			'txtPg3S1I4Total',
			'-txtPg3S1I5LessSales',
		]
	},
	{
		outputs: ['txtPg3S2I3TotalGoods'],
		inputs: [
			'txtPg3S2I1MerchInventory',
			'txtPg3S2I2AddPurchases',
		]
	},
	{
		outputs: ['txtPg3S2I5CostSales'],
		inputs: [
			'txtPg3S2I3TotalGoods',
			'-txtPg3S2I4LessMerch',
		]
	},
	{
		outputs: ['txtPg3S2I8MaterialsAvailable'],
		inputs: [
			'txtPg3S2I6DirectMaterials',
			'txtPg3S2I7AddPurchases',
		]
	},
	{
		outputs: ['txtPg3S2I10RawMaterials'],
		inputs: [
			'txtPg3S2I8MaterialsAvailable',
			'-txtPg3S2I9DirectMaterials',
		]
	},
	{
		outputs: ['txtPg3S2I13TotalMan'],
		inputs: [
			'txtPg3S2I10RawMaterials',
			'txtPg3S2I11DirectLabor',
			'txtPg3S2I12ManOverhead',
		]
	},
	{
		outputs: ['txtPg3S2I16CostOfGoods'],
		inputs: [
			'txtPg3S2I13TotalMan',
			'txtPg3S2I14WorkProcess',
			'-txtPg3S2I15LessWork',
		]
	},
	{
		outputs: ['txtPg3S2I19GoodsManAndSold'],
		inputs: [
			'txtPg3S2I16CostOfGoods',
			'txtPg3S2I17FinishedGoods',
			'-txtPg3S2I18LessFinished',
		]
	},
	{
		outputs: ['txtPg3S2I26TotalCostServices'],
		inputs: [
			'txtPg3S2I20DirectWage',
			'txtPg3S2I21DirectMaterials',
			'txtPg3S2I22DirectDepreciation',
			'txtPg3S2I23DirectRental',
			'txtPg3S2I24DirectOutside',
			'txtPg3S2I25DirectOthers',
		]
	},
	{
		outputs: ['txtPg3S2I27TotalCostSales', 'txtPg2Pt4I32LessCost'],
		inputs: [
			'txtPg3S2I5CostSales',
			'txtPg3S2I19GoodsManAndSold',
			'txtPg3S2I26TotalCostServices',
		]
	},
	{
		outputs: ['txtPg4S3I4TotalTaxIncome', 'txtPg2Pt4I34AddOther'],
		inputs: [
			'txtPg4S3I1Col2',
			'txtPg4S3I2Col2',
			'txtPg4S3I3Col2',
		]
	},
	{
		outputs: ['txtPg5S4I40TotalAllowableDeduction', 'txtPg2Pt4I36OrdinaryAllowable'],
		inputs: [
			'txtPg4S4I1AdsAndPromotions',
			'txtPg4S4I2Col2',
			'txtPg4S4I3Col2',
			'txtPg4S4I4Col2',
			'txtPg4S4I5BadDebts',
			'txtPg4S4I6CharitableContri',
			'txtPg4S4I7Commissions',
			'txtPg4S4I8Communication',
			'txtPg4S4I9Depletion',
			'txtPg4S4I10Depreciation',
			'txtPg4S4I11DirectorFees',
			'txtPg4S4I12FringeBenefits',
			'txtPg4S4I13FuelAndOil',
			'txtPg4S4I14Insurance',
			'txtPg4S4I15Interest',
			'txtPg4S4I16Janitorial',
			'txtPg4S4I17Losses',
			'txtPg4S4I18Management',
			'txtPg4S4I19Insurance',
			'txtPg4S4I20OfficeSupplies',
			'txtPg4S4I21OtherServices',
			'txtPg4S4I22PersonalFees',
			'txtPg4S4I23Rental',
			'txtPg4S4I24RepairLabor',
			'txtPg4S4I25RepairMaterials',
			'txtPg4S4I26Representation',
			'txtPg4S4I27Research',
			'txtPg4S4I28Royalties',
			'txtPg4S4I29Salaries',
			'txtPg5S4I30SecurityServices',
			'txtPg5S4I31SSS',
			'txtPg5S4I32TaxesAndLicense',
			'txtPg5S4I33TollingFees',
			'txtPg5S4I34Training',
			'txtPg5S4I35Transportation',
			'txtPg5S4I36Col2',
			'txtPg5S4I37Col2',
			'txtPg5S4I38Col2',
			'txtPg5S4I39Col2',
		]
	},
	{
		outputs: ['txtPg5S5I5TotalAllowable', 'txtPg2Pt4I37SpecialAllowable'],
		inputs: [
			'txtPg5S5I1Col3',
			'txtPg5S5I2Col3',
			'txtPg5S5I3Col3',
			'txtPg5S5I4Col3',
		]
	},
	{
		outputs: ['txtPg5S6I4Total'],
		inputs: [
			'txtPg5S6I1NetIncomeLoss',
			'txtPg5S6I2Col2',
			'txtPg5S6I3Col2',
		]
	},
	{
		outputs: ['txtPg5S6I9Col2'],
		inputs: [
			'txtPg5S6I5Col2',
			'txtPg5S6I6Col2',
			'txtPg5S6I7Col2',
			'txtPg5S6I8Col2',
		]
	},
	{
		outputs: ['txtPg5S6I10NetTaxable'],
		inputs: [
			'txtPg5S6I4Total',
			'-txtPg5S6I9Col2',
		]
	},
	{
		outputs: ['txtPg6S7I7TotalAssets'],
		inputs: [
			'txtPg6S7I1CurrentAssets',
			'txtPg6S7I2LongInvestment',
			'txtPg6S7I3Property',
			'txtPg6S7I4LongReceivables',
			'txtPg6S7I5IntangibleAssets',
			'txtPg6S7I6OtherAssets',
		]
	},
	{
		outputs: ['txtPg6S7I12TotalLiabilities'],
		inputs: [
			'txtPg6S7I8CurrentLiabilities',
			'txtPg6S7I9LongLiabilities',
			'txtPg6S7I10DefferedCredits',
			'txtPg6S7I11OtherLiablities',
		]
	},
	{
		outputs: ['txtPg6S7I16TotalEquity'],
		inputs: [
			'txtPg6S7I13CapitalStock',
			'txtPg6S7I14AdditionalCapital',
			'txtPg6S7I15RetainedEarnings',
		]
	},
	{
		outputs: ['txtPg6S7I17LiabilitiesAndEquity'],
		inputs: [
			'txtPg6S7I12TotalLiabilities',
			'txtPg6S7I16TotalEquity',
		]
	},
];
