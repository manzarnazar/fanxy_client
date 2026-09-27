// image_upload — confirmed against a real response: `result` is a single
// OBJECT (not a list), and content_type comes back as a string.
// Step 1 of the two-step post-creation flow: upload the media first, then
// pass the returned names/urls into upload_post's post_content field.
export interface ApiUploadedMediaResult {
  content_type: string;
  image_name: string | null;
  image_url: string | null;
  video_name: string | null;
  video_url: string | null;
}

export interface ApiImageUploadResponse {
  status: number;
  message: string;
  result: ApiUploadedMediaResult;
}
