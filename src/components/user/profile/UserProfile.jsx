import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";
import useAuth from "../../../hooks/useAuth";
import InsuranceApi, { setupInterceptors } from "../../api/InsuranceApi";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const { userId } = user;

  const [image, setImage] = useState([]);
  const [imageName, setImageName] = useState("");
  const [currentImage, setCurrentImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(true);
  const [accountInfo, setAccountInfo] = useState("");
  const [activeTab, setActiveTab] = useState("password");
  const [message, setMessage] = useState(""); // Combined state for success and error messages
  const [updateInfo, setUpdateInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupInterceptors(() => user, setUser);
    fetchUser();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUser = async () => {
    try {
      const url =
       ( user.role === "INSURER_ADMIN" || user.role === "IT_ADMIN" || user.role === "PRODUCT_MANAGER" || user.role === "IT_SUPPORT" || user.role === "MANAGER" || user.role === "TREASURY_ACCOUNTANT")
          ? `/insurer-users/user/${userId}`
          : `/users/userId/${userId}`;
      const response = await InsuranceApi.get(url);
      if (response && (response.data.message === "User found" || response.data.message === "retrieved successfully")) {
        console.log(response);
        setAccountInfo(response.data.data);
      }
    } catch (err) {
      console.log(err);
      setMessage("Error fetching user");
    }
  };

  const updateUser = async () => {
    setLoading(true);
    setMessage("Updating Password...");
    let modifiedUpdateInfo = { ...updateInfo }; // Create a copy of updateInfo

    if (
        user.role === "INSURER_ADMIN" ||
        user.role === "IT_ADMIN" ||
        user.role === "PRODUCT_MANAGER" ||
        user.role === "IT_SUPPORT" ||
        user.role === "MANAGER" ||
        user.role === "TREASURY_ACCOUNTANT"
    ) {
        // Remove confirmationPassword and add email
        const { confirmationPassword, ...rest } = modifiedUpdateInfo;
        modifiedUpdateInfo = { ...rest, email: accountInfo.email };
    }

    try {
        const response = (user.role === "INSURER_ADMIN" || user.role === "IT_ADMIN" || user.role === "PRODUCT_MANAGER" || user.role === "IT_SUPPORT" || user.role === "MANAGER" || user.role === "TREASURY_ACCOUNTANT")
            ? await InsuranceApi.put(`insurer-users/change-password`, modifiedUpdateInfo)
            : await InsuranceApi.patch(`/users/change-password`, modifiedUpdateInfo);

        // Check if response is valid and log it
        console.log("Response >>>:", response.data);

        if (response.data) {
            console.log("Response Data:", response.data); // Log response.data
            setMessage("Password updated successfully");
            fetchUser();
        }
    } catch (err) {
        console.log("Error:", err); // Log the error if the API call fails
        setMessage("Error updating password");
    } finally {
        setLoading(false);
    }
};

  const updateUserImage = async () => {
    setLoading(true);
    setMessage("Updating Profile Picture...");
    try {
      const response = await InsuranceApi.patch(`/users/logo`, {
        userLogo: image,
      });
      if (response) {
        console.log(response);
        setMessage("Profile picture updated successfully");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error updating image");
    } finally {
      setLoading(false);
      fetchUser();
    }
  };

  const getModal = (isOpen) => {
    setCurrentImage(isOpen);
  };

  const getImage = (image, imageName) => {
    setImage(image);
    setImageName(imageName);
  };

  const showModal = (showPage) => {
    setCurrentPage(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setUpdateInfo({ ...updateInfo, [name]: value });
  };

  const passwordReset = () => {
    return (
      <>
        <div className="sm:col-span-3 flex items-center">
          <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
            Current Password
          </label>
          <div className="mt-2 flex-1">
            <input
              type="password"
              id="currentPassword"
              autoComplete="current-password"
              placeholder="Current Password"
              name="currentPassword"
              value={updateInfo["currentPassword"] || ""}
              onChange={handlePasswordChange}
              className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-3 flex items-center">
          <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
            New Password
          </label>
          <div className="mt-2 flex-1">
            <input
              type="password"
              id="newPassword"
              autoComplete="new-password"
              placeholder="New Password"
              name="newPassword"
              value={updateInfo["newPassword"] || ""}
              onChange={handlePasswordChange}
              className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-3 flex items-center">
          <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
            Repeat New Password
          </label>
          <div className="mt-2 flex-1">
            <input
              type="password"
              id="confirmationPassword"
              autoComplete="new-password"
              placeholder="Repeat New Password"
              name="confirmationPassword"
              value={updateInfo["confirmationPassword"] || ""}
              onChange={handlePasswordChange}
              className="block w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        {message && <p className={`mt-2 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
        <div className="flex space-x-2 pt-10">
          <button
            onClick={updateUser}
            disabled={loading}
            className={`px-4 py-2 bg-secondary-color text-white rounded-full hover:bg-main-color w-40 transition-colors duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            className={`border border-gray-300 rounded-full px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  const imageUpdate = () => {
    return (
      <>
        {currentImage && <ImageModal setModal={getModal} setShow={showModal} setImageDetails={getImage} />}
        <div className="sm:col-span-3 flex items-center">
          <label htmlFor="image-upload" className="block text-sm font-medium leading-6 text-gray-900 w-1/4">
            Upload Image
          </label>
          <div className="mt-2 flex-1">
            <label
              onClick={() => setCurrentImage(true)}
              className="w-full rounded-xs border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6 cursor-pointer flex items-center"
            >
              <span className="fas fa-upload text-gray-500 mr-2"></span>
              <span>{imageName || "Upload Logo"}</span>
            </label>
          </div>
        </div>
        {message && <p className={`mt-2 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
        <div className="flex space-x-2 pt-10">
          <button
            onClick={updateUserImage}
            disabled={loading}
            className={`px-4 py-2 bg-secondary-color rounded-full text-white hover:bg-main-color w-40 transition-colors duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            className={`border border-gray-300 rounded-full px-4 py-2 bg-gray-700 text-gray-100 hover:text-gray-700 hover:bg-white w-40`}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  const displayUserRole = (role) => {
    if (role === "SUPER_ADMINISTRATOR") return "Super Administrator";
    if (role === "ADMIN" || role === "INSURER_ADMIN") return "System Administrator";
    if (role === "SALES_AGENT") return "Cashier";
  };

  if (accountInfo)
    return (
      <div className="p-8 flex justify-between w-full">
        <div className="flex flex-col flex-1 relative">
          <div className="flex space-x-4">
            <div className="flex w-32 h-32 overflow-hidden rounded-md">
              <img
                src={accountInfo.userLogo ? accountInfo.userLogo : "images/user.png"}
                alt="Profile"
                className="w-32 h-32 bg-gradient-to-b from-main-color to-secondary-color mb-4 object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold">
                {accountInfo.firstname || accountInfo.firstName} {accountInfo.lastname || accountInfo.lastName}
              </p>
              <p className="text-gray-600 mt-1 underline">{displayUserRole(accountInfo.role)}</p>
              <p className="text-sm text-gray-500 mt-1">
                {accountInfo.email}
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "SALES_AGENT") &&
                  "@telone.co.zw"}
              </p>
            </div>
          </div>
          {(user.role === "ADMIN" || user.role === "SALES_AGENT") && (
            <div className="flex mt-8 space-x-3">
                {accountInfo.userRegions && accountInfo.userRegions.length > 0 ? (
                    <p className="flex flex-col text-xs font-semibold">
                        Assigned Region
                        <span className="text-2xl text-main-color">
                            {accountInfo.userRegions[0]}
                        </span>
                    </p>
                ) : accountInfo.userTowns && accountInfo.userTowns.length > 0 ? (
                    <p className="flex flex-col text-xs font-semibold">
                        Assigned Town
                        <span className="text-2xl text-main-color">
                            {accountInfo.userTowns[0]}
                        </span>
                    </p>
                ) : accountInfo.userShops && accountInfo.userShops.length > 0 ? (
                    <p className="flex flex-col text-xs font-semibold">
                        Assigned Shop
                        <span className="text-2xl text-main-color">
                            {accountInfo.userShops[0]}
                        </span>
                    </p>
                ) : (
                    <p className="flex flex-col text-xs font-semibold">
                        Overall Access
                    </p>
                )}
            </div>
        )}
        </div>
        <div className="bg-gradient-to-t from-main-color to-secondary-bg-secondary-color w-[1px]" />
        <div className="flex flex-1 flex-col mx-2 space-y-2">
          <div className="flex flex-row space-x-4">
            <button
              className="bg-gradient-to-r from-main-color to-secondary-color rounded-full py-1 w-48 text-white"
              onClick={() => setActiveTab("password")}
            >
              <i className="fa fa-edit mr-2" />
              Edit Password
            </button>
            <button
              className={`${(user.role === "INSURER_ADMIN" || user.role === "IT_ADMIN" || user.role === "PRODUCT_MANAGER" || user.role === "IT_SUPPORT" || user.role === "MANAGER" || user.role === "TREASURY_ACCOUNTANT") ? "hidden" : ""} bg-gradient-to-r from-secondary-color to-main-color rounded-full py-1 w-48 text-white`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa fa-edit mr-2" />
              Edit Profile Picture
            </button>
          </div>
          {activeTab === "password" ? passwordReset() : imageUpdate()}
        </div>
      </div>
    );

  return <div className="p-8 flex justify-between w-full">{message}</div>;
}