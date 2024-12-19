import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchData = (resource, id = null, options = {}, params = {}) => {
  const url = id ? `/api/${resource}/${id}` : `/api/${resource}`;

  // Fetching function
  const fetchData = async () => {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      params, // Attach query parameters like search, pagination, etc.
    });
    return response.data;
  };

  // Using React Query's useQuery hook for fetching the data
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: [resource, id, params], // In React Query v5, use queryKey as an object
    queryFn: fetchData, // The function that fetches the data
    ...options,
    enabled: !!resource, // Only enable if resource is provided
  });

  return { data, isLoading, error, isSuccess };
};

export default useFetchData;

//implementation
//  // component start

//  const params = {
//   page: currentPage,
//   limit: itemsPerPage,
//   search: searchTerm,
// };

// const options = {
//   enabled: true,
//   refetchOnWindowFocus: true,
//   retry: 3,
// };

// const {
//   data: departmentData,
//   isLoading: isDepartmentLoading,
//   error: isDepartmentError,
//   isSuccess: isDepartmentSuccess,
// } = useFetchData("departments", null, options, params);

// const handleInvalidateQuery = () => {
//   // Invalidate the 'departments' query to trigger a refetch
//   queryClient.invalidateQueries(["departments", null, params]);
// };

// useEffect(() => {
//   if (isDepartmentSuccess) {
//     setDepartments(departmentData.data.Departments);
//     setPagination(departmentData.data.Pagination);
//   }
//   if (isDepartmentError) {
//     console.log("Error", isDepartmentError.message);
//   }

//   handleInvalidateQuery();
// }, [departmentData, params]);

// // component end
