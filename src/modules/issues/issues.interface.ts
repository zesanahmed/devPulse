export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IUpdateStatus {
  status: "open" | "in_progress" | "resolved";
}
