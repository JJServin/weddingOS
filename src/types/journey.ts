export type PartnerId = 'partner-a' | 'partner-b';
export type Role = PartnerId | 'together';
export type JourneyMode = 'core' | 'christ-centered';
export type ReflectionState = 'not-started' | 'answered' | 'silent-reflection' | 'needs-time' | 'skipped';
export type SharingLevel = 'private' | 'share-exact' | 'summary-requested' | 'self-share' | 'not-ready';
export type MirrorAssessment = 'reflects' | 'partly' | 'not-quite' | 'do-not-save';
export type PauseCheckValue = 'understand-better' | 'important-difference' | 'need-time' | 'defensive' | 'outside-guidance' | 'peaceful' | 'emotionally-tired';
export interface PartnerFeedback { scales:Record<string,number>; strongestMoment?:string; importantChange?:string }
export interface PartnerResponse { promptId:string; responseText?:string; responseState:ReflectionState; sharingLevel:SharingLevel; approvedSummary?:string }
export interface PartnerState { preparationStatus:'not-started'|'in-progress'|'complete'; responses:Record<string,PartnerResponse>; integration?:{learned?:string;heard?:string;unable?:string;next?:string}; feedback?:PartnerFeedback }
export interface SharedState { mode:JourneyMode; stage:string; previousPath?:string; bridgeApprovals:PartnerId[]; discoveries:{discovered?:string;needsClarity?:string;understandsBetter?:string;status?:string;nextStep?:string}; sharedNotes?:string; mirror:{generatedText:string;assessment?:MirrorAssessment;corrections:Partial<Record<'partly'|'not-quite',string>>;saveApproved:boolean}; pauseCheck?:PauseCheckValue }
export interface JourneyState { role:Role; partners:Record<PartnerId,PartnerState>; shared:SharedState }
