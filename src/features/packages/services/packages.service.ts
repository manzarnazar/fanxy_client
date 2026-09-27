import apiClient from "@/services/api.client";
import type { ApiSuccessEnvelope } from "@/types/api/common.types";
import type { ApiCreatorPackagesResponse } from "@/types/api/creator-dashboard.types";
import type { PackageFormInput } from "@/features/packages/types/packages.types";

function buildPackageForm(input: PackageFormInput): FormData {
  const form = new FormData();
  form.append("name", input.name);
  form.append("price", input.price);
  form.append("time", input.periodCount);
  form.append("type", input.period);
  form.append("can_chat", input.canChat ? "1" : "0");
  form.append("can_view_live_stream", input.canViewLiveStream ? "1" : "0");
  return form;
}

// Endpoint names and request fields confirmed against the real Flutter
// app's lib/webservice/apiservices.dart (get_creator_package,
// add_creator_package, edit_creator_package, delete_creator_package) —
// not guesses. There is no image-upload field, no status-toggle endpoint,
// and no per-package subscriber/revenue stats on this model — `time` +
// `type` together are the billing period ("every N days/weeks/months/years").
export const packagesService = {
  getPackages: (userId: string, page: number) =>
    apiClient.post<ApiCreatorPackagesResponse>("get_creator_package", { to_user_id: userId, page }),

  createPackage: (input: PackageFormInput) => apiClient.post<ApiSuccessEnvelope>("add_creator_package", buildPackageForm(input)),

  editPackage: (packageId: string, input: PackageFormInput) => {
    const form = buildPackageForm(input);
    form.append("creator_package_id", packageId);
    return apiClient.post<ApiSuccessEnvelope>("edit_creator_package", form);
  },

  deletePackage: (packageId: string) =>
    apiClient.post<ApiSuccessEnvelope>("delete_creator_package", { creator_package_id: packageId }),
};
