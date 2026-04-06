import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";

export function useConfig() {
    const addressAndThemeData = useAppSelector(selectAddressApiData);

    const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;

    return settings;
}
