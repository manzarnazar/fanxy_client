// get_gift — confirmed against the Flutter app's lib/model/livegiftmodel.dart.
export interface ApiLiveGiftResult {
  id: number;
  name: string;
  image: string | null;
  coin: number;
  status: number;
}
