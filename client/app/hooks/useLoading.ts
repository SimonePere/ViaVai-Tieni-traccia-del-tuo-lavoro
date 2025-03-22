import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/slices/loadingSlice";

const useLoading = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: { loading: { isLoading: boolean } }) => state.loading.isLoading);

    const startLoading = () => dispatch(showLoading());
    const stopLoading = () => dispatch(hideLoading());

    return { isLoading, startLoading, stopLoading };
};

export default useLoading; 