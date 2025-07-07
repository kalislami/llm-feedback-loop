export class CreateRLHFFeedbackDto {
  prompt: string;
  responses: { text: string; id: string }[];
  ranking?: number[];
  bestIndex?: number;
  comment?: string;
}
