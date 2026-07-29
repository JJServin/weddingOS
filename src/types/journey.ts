export type PartnerId = 'partner-a' | 'partner-b';
export type Role = PartnerId | 'together';
export type JourneyMode = 'core' | 'christ-centered';
export type ReflectionState = 'not-started' | 'answered' | 'silent-reflection' | 'needs-time' | 'skipped';
export type SharingLevel = 'private' | 'share-exact' | 'summary-requested' | 'self-share' | 'not-ready';
export interface PartnerResponse { promptId:string; responseText?:string; responseState:ReflectionState; sharingLevel:SharingLevel; approvedSummary?:string }
export interface PartnerState { preparationStatus:'not-started'|'in-progress'|'complete'; responses:Record<string,PartnerResponse>; integration?:{learned?:string;heard?:string;unable?:string;next?:string} }
export interface SharedState { mode:JourneyMode; stage:string; previousPath?:string; bridgeApprovals:PartnerId[]; discoveries:{discovered?:string;needsClarity?:string;understandsBetter?:string;status?:string;nextStep?:string}; sharedNotes?:string }
export interface JourneyState { role:Role; partners:Record<PartnerId,PartnerState>; shared:SharedState }
