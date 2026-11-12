/** App-managed working copies. Successful BIR uploads remain in return history. */
export type CreatedReturnStatus = 'Draft' | 'Final' | 'Submitted' | 'For resubmission' | 'Simulated';
export type CreatedReturn = {
 id: string;
 taxpayerId: string;
 formCode: string;
 returnPeriod: string;
 status: CreatedReturnStatus;
 updatedAt: number;
 values: Record<string, string>;
 finalFlag: string;
 archived?: boolean;
};
export type CreatedReturnsData = { version: 1; returns: CreatedReturn[]; archivedTaxpayerIds: string[] };
const storageKey = 'ebirforms-created-returns-v1';
const statuses: CreatedReturnStatus[] = ['Draft', 'Final', 'Submitted', 'For resubmission', 'Simulated'];
function isObject(value: unknown): value is Record<string, unknown> {
 return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isCreatedReturn(value: unknown): value is CreatedReturn {
 return isObject(value) && ['id', 'taxpayerId', 'formCode', 'returnPeriod', 'finalFlag'].every(key => typeof value[key] === 'string')
  && Boolean(value.id) && Boolean(value.taxpayerId) && Boolean(value.formCode)
  && statuses.includes(value.status as CreatedReturnStatus)
  && (!('archived' in value) || typeof value.archived === 'boolean')
  && typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
  && isObject(value.values) && Object.values(value.values).every(item => typeof item === 'string');
}
export function loadCreatedReturnsData(): CreatedReturnsData {
 const text = localStorage.getItem(storageKey);
 if (text === null) return { version: 1, returns: [], archivedTaxpayerIds: [] };
 const parsed: unknown = JSON.parse(text);
 if (!isObject(parsed) || parsed.version !== 1 || !Array.isArray(parsed.returns)
  || !parsed.returns.every(isCreatedReturn) || !Array.isArray(parsed.archivedTaxpayerIds)
  || !parsed.archivedTaxpayerIds.every(id => typeof id === 'string')
  || new Set(parsed.returns.map(record => record.id)).size !== parsed.returns.length) {
  throw new Error('Saved form data is invalid. Existing data was left unchanged.');
 }
 return parsed as CreatedReturnsData;
}
export function saveCreatedReturnsData(data: CreatedReturnsData): void {
 localStorage.setItem(storageKey, JSON.stringify(data));
}
