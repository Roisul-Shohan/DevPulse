export interface TIssuePayload {
  title: string;
  description: string;
  type: "bug" | "feature_request";
};