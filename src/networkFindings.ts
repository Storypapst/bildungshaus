import data from './content/network-findings.json'
import type { Problem } from './types'
export type NetworkFinding = Pick<Problem,'id'|'title'|'metric'|'metricLabel'|'summary'|'detail'|'documentId'|'sources'|'evidenceStatus'> & {mapKey:string;mapTitle:string;baseNodeId:string}
export const networkFindings: NetworkFinding[] = data
export const networkById = new Map(networkFindings.map(finding=>[finding.id,finding]))
export const networkByMapKey = new Map(networkFindings.map(finding=>[finding.mapKey,finding]))
