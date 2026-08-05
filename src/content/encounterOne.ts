export const promptIds=['marriage-sentence','ten-year-words','promise','marriage-open-question'] as const;
export const wordOptions=['Faithful','Honest','Peaceful','Joyful','Secure','Affectionate','Playful','Supportive','Generous','Resilient','Purposeful','Hospitable','Restful','Adventurous','Something else','I am not sure yet'];
export const promiseOptions=['Faithfulness','Mutual service','Companionship','Building a family life','Public commitment','Hospitality and community','A shared future','Something else','I am not ready to choose'];
export const openQuestionOptions=['No significant marriage-level question comes to mind.','There is something I want to explore privately.','There is something I may be ready to discuss.','I am unsure.','I need more time.'];
export const needOptions=['A conversation together','Personal growth','More information','Reassurance','Premarital counseling','Pastoral guidance','More time','I am not sure'];
export const beliefSourceOptions=['Scripture','Church teaching','Personal conscience','Life experience','Hope for our future','I am not sure yet'];
export const content={welcome:{title:'What Are We Saying Yes To?',body:'Before deciding what your wedding should look like, begin with what marriage means to each of you. This encounter will help you name the shared life you believe you are beginning, understand the promises that matter most to your partner, and recognize what still deserves conversation. WeddingOS will not decide whether, when or how you should marry.'},prepare:{title:'What Am I Saying Yes To?',body:'Before speaking together, take a few minutes to hear yourself. Set aside the venue, guest list, destination, cost, timeline and family expectations. Focus on the marriage—the ordinary life, promises and partnership you believe you are beginning. You do not need an impressive answer. You only need an honest one.'}};
export function responseSummary(r:{promptId?:string;text?:string;selectedValues?:string[];selectedValue?:string;customValue?:string;optionalFollowUp?:string;secondaryFollowUp?:string},includePrivateStory=false){
  if(r.promptId==='marriage-sentence'){
    const parts:string[]=[];
    if(r.text?.trim()) parts.push(`I described marriage as the lifelong practice of ${r.text.trim()}.`);
    if(r.optionalFollowUp?.trim()) parts.push(`During an ordinary week, that could mean ${r.optionalFollowUp.trim()}.`);
    if(r.selectedValues?.length) parts.push(`This understanding has been shaped by ${r.selectedValues.join(' and ').toLowerCase()}.`);
    if(includePrivateStory&&r.secondaryFollowUp?.trim()) parts.push(r.secondaryFollowUp.trim());
    return parts.join(' ');
  }
  return [r.text,r.selectedValues?.join(', '),r.selectedValue,r.customValue,r.optionalFollowUp].filter(Boolean).join(' — ')
}
