const SERVER_URL = ""; // empty string to use proxy configured in vite.config.js

/**
 * Helper to get the auth token from local storage
 */
const getAuthToken = () => {
  try {
    return JSON.parse(localStorage.getItem("authToken"));
  } catch {
    return null;
  }
};

/**
 * Generic request handler to reduce boilerplate code
 */
const buildHeaders = (contentType, useAuth) => {
  const headers = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (useAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponseError = async (
  response,
  customErrorMap,
  defaultErrorMessage
) => {
  let errorData = {};
  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      errorData = await response.json();
    }
  } catch (err) {
    console.warn("Failed to parse error response JSON:", err);
  }

  if (customErrorMap[response.status]) {
    throw new Error(errorData.error || customErrorMap[response.status]);
  }

  throw new Error(errorData.error || errorData.message || defaultErrorMessage);
};

const parseSuccessResponse = async (response) => {
  if (response.status === 204) return null;
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Failed to parse success response as JSON:", err);
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    useAuth = true,
    contentType = "application/json",
    customErrorMap = {},
    defaultErrorMessage = "Operation failed",
  } = options;

  const headers = buildHeaders(contentType, useAuth);

  const config = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    config.body =
      contentType === "application/json" ? JSON.stringify(body) : body;
  }

  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${SERVER_URL}${safeEndpoint}`, config);

  if (response.ok) {
    return await parseSuccessResponse(response);
  }

  await handleResponseError(response, customErrorMap, defaultErrorMessage);
};

const registerCitizen = async (credentials) => {
  try {
    const responseData = await request("api/citizens/register", {
      method: "POST",
      useAuth: false,
      body: {
        email: credentials.email,
        username: credentials.username,
        firstName: credentials.name,
        lastName: credentials.surname,
        password: credentials.password,
      },
      customErrorMap: {
        400: "Password must have at least 6 characters",
        409: "Email or username already in use",
      },
      defaultErrorMessage: "Registration failed",
    });
    return responseData.user;
  } catch (error) {
    console.error("Error during citizen registration:", error);
    throw error;
  }
};

const performLogin = async (endpoint, credentials) => {
  const responseData = await request(endpoint, {
    method: "POST",
    useAuth: false,
    body: {
      email: credentials.email,
      password: credentials.password,
    },
    customErrorMap: {
      400: "Email and password are required",
      401: "Invalid email or password",
      403: "EMAIL_NOT_VERIFIED",
    },
    defaultErrorMessage: "Login failed",
  });

  const token = {
    accessToken: responseData.access_token,
    tokenType: responseData.token_type,
  };
  localStorage.setItem("authToken", JSON.stringify(token.accessToken));
  return token;
};

const loginCitizen = async (credentials) => {
  try {
    return await performLogin("api/auth/citizens/login", credentials);
  } catch (error) {
    console.error("Error during citizen login:", error);
    throw error;
  }
};

const loginInternalUser = async (credentials) => {
  try {
    return await performLogin("api/auth/internal/login", credentials);
  } catch (error) {
    console.error("Error during internal user login:", error);
    throw error;
  }
};

const getUserInfo = async () => {
  try {
    const user = await request("api/auth/me", {
      method: "GET",
      defaultErrorMessage: "Failed to fetch user info",
    });
    return user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await request("api/auth/logout", {
      method: "POST",
      defaultErrorMessage: "Logout failed",
    });
    localStorage.removeItem("authToken");
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

const getAllInternalUsers = async () => {
  try {
    const data = await request("api/admin/internal-users", {
      method: "GET",
      defaultErrorMessage: "Failed to retrieve internal users",
    });
    return data;
  } catch (error) {
    console.error("Error fetching internal users:", error);
    throw error;
  }
};

const registerInternalUser = async (credentials) => {
  try {
    const user = await request("api/admin/internal-users", {
      method: "POST",
      body: {
        firstName: credentials.name,
        lastName: credentials.surname,
        email: credentials.email,
        password: credentials.password,
      },
      customErrorMap: {
        400: "Validation error",
        409: "Email already in use",
      },
      defaultErrorMessage: "Registration failed",
    });
    return user;
  } catch (error) {
    console.error("Error registering internal user:", error);
    throw error;
  }
};

const updateInternalUserRole = async (
  id,
  name,
  surname,
  email,
  roleIds,
  companyId = null
) => {
  try {
    const rolesArray = Array.isArray(roleIds) ? roleIds : [roleIds];

    const body = {
      newEmail: email,
      newFirstName: name,
      newLastName: surname,
      roleIds: rolesArray,
    };

    if (companyId !== null && companyId !== undefined) {
      body.companyId = companyId;
    }

    const data = await request(`api/admin/internal-users/${id}`, {
      method: "PUT",
      body,
      customErrorMap: {
        400: "Invalid ID or validation error",
        409: "Email already in use",
      },
      defaultErrorMessage: "Update failed",
    });
    return data;
  } catch (error) {
    console.error("Error updating internal user role:", error);
    throw error;
  }
};

const getAllRoles = async () => {
  try {
    const data = await request("api/admin/roles", {
      method: "GET",
      customErrorMap: {
        400: "Could not fetch roles",
      },
      defaultErrorMessage: "Failed to fetch roles",
    });
    return data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

const addNewReport = async (reportData) => {
  const requestBody = {
    isAnonymous: reportData.isAnonymous,
    title: reportData.title,
    description: reportData.description,
    categoryId: reportData.categoryId,
    location: reportData.location,
    photoIds: reportData.photoIds,
  };

  try {
    const data = await request("api/citizens/report", {
      method: "POST",
      body: requestBody,
      customErrorMap: {
        400: "Validation error",
        401: "Unauthorized",
        403: "Forbidden",
        413: "Files are too large. Please upload smaller files.",
      },
      defaultErrorMessage: "Failed to create report",
    });
    return data;
  } catch (error) {
    console.error("Error adding new report:", error);
    throw error;
  }
};

const judgeReport = async (reportId, status, categoryId, explanation) => {
  try {
    const data = await request(`api/internal/reports/${reportId}`, {
      method: "PATCH",
      body: {
        status: status,
        categoryId: categoryId,
        explanation: explanation,
      },
      defaultErrorMessage: "Failed to judge report",
    });
    return data;
  } catch (error) {
    console.error("Error judging report:", error);
    throw error;
  }
};

const getAllCategories = async () => {
  try {
    const data = await request("api/categories", {
      method: "GET",
    });
    return data ? data.slice(0, 8) : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const uploadFile = async (formData, type = "report") => {
  try {
    if (!formData.has("type")) {
      formData.append("type", type);
    }

    const data = await request("api/files/upload", {
      method: "POST",
      body: formData,
      contentType: null,
      customErrorMap: {
        400: "File validation failed",
        401: "Unauthorized",
      },
      defaultErrorMessage: "Failed to upload file",
    });
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

const deleteTempFile = async (fileId) => {
  try {
    await request(`api/files/temp/${fileId}`, {
      method: "DELETE",
      customErrorMap: {
        400: "File ID missing or invalid",
        401: "Unauthorized",
      },
      defaultErrorMessage: "Failed to delete file",
    });
    return true;
  } catch (error) {
    console.error("Error deleting temporary file:", error);
    throw error;
  }
};

const getAllReportsIsPending = async () => {
  try {
    const data = await request("api/internal/reports", {
      method: "GET",
      customErrorMap: {
        400: "Error retrieving reports",
        401: "Unauthorized",
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    throw error;
  }
};

const getCitizenReports = async () => {
  try {
    const data = await request("api/citizens/reports/myReports", {
      method: "GET",
      customErrorMap: {
        401: "Unauthorized",
        403: "Forbidden",
      },
      defaultErrorMessage: "Failed to fetch citizen reports",
    });
    return data;
  } catch (error) {
    console.error("Error fetching citizen reports:", error);
    throw error;
  }
};

const getPublicReports = async (bounds) => {
  try {
    const data = await request("api/reports/map", {
      method: "POST",
      body: {
        corners: bounds,
      },
      customErrorMap: {
        400: "Error retrieving public reports",
      },
      defaultErrorMessage: "Failed to fetch public reports",
    });
    return data;
  } catch (error) {
    console.error("Error fetching public reports by map area:", error);
    throw error;
  }
};

const getReportMapDetails = async (reportId) => {
  try {
    const data = await request(`api/reports/getById/${reportId}`, {
      method: "GET",
      customErrorMap: {
        400: "Error retrieving report map details, Invalid report ID",
        404: "Report not found",
      },
      defaultErrorMessage: "Failed to fetch report map details",
    });
    return data;
  } catch (error) {
    console.error("Error fetching report map details:", error);
    throw error;
  }
};

const getReportsAssignedToMe = async () => {
  try {
    const data = await request("api/internal/reports/assigned", {
      method: "GET",
      customErrorMap: {
        401: "Unauthorized",
        403: "Forbidden",
      },
      defaultErrorMessage: "Failed to fetch internal user assigned reports",
    });
    return data;
  } catch (error) {
    console.error("Error fetching reports assigned to technical user:", error);
    throw error;
  }
};

const updateCitizenProfile = async (profileData) => {
  try {
    const data = await request("api/citizens/me", {
      method: "PATCH",
      body: profileData,
      customErrorMap: {
        400: "Validation error",
        401: "Unauthorized",
        404: "Citizen profile not found",
      },
      defaultErrorMessage: "Failed to update profile",
    });
    return data.profile || data;
  } catch (error) {
    console.error("Error updating citizen profile:", error);
    throw error;
  }
};

const getAllCompanies = async () => {
  try {
    const data = await request("api/companies", {
      method: "GET",
      customErrorMap: {
        400: "Error when fetching companies",
      },
      defaultErrorMessage: "Failed to fetch companies",
    });
    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

const getCompaniesByCategory = async (categoryId) => {
  try {
    const data = await request(`api/companies/category/${categoryId}`, {
      method: "GET",
      customErrorMap: {
        400: "Error when fetching companies by category",
      },
      defaultErrorMessage: "Failed to fetch companies by category",
    });
    return data;
  } catch (error) {
    console.error("Error fetching companies by category:", error);
    throw error;
  }
};

const delegateReportToCompany = async (reportId, companyId) => {
  try {
    const data = await request(`api/internal/reports/${reportId}/delegate`, {
      method: "PATCH",
      body: {
        companyId: companyId,
      },
      customErrorMap: {
        400: "Validation error",
        403: "Forbidden - Only the currently assigned officer can delegate this report",
        404: "Report not found",
      },
      defaultErrorMessage: "Failed to delegate report to company",
    });
    return data;
  } catch (error) {
    console.error("Error delegating report to company:", error);
    throw error;
  }
};

const updateReportStatus = async (reportId, status, note) => {
  try {
    const data = await request(`api/internal/reports/${reportId}`, {
      method: "PATCH",
      body: {
        status: status,
        categoryId: null,
        explanation: note,
      },
      customErrorMap: {
        400: "Validation error",
        403: "Forbidden - Only the currently assigned officer can update this report",
        404: "Report not found",
      },
      defaultErrorMessage: "Failed to update report status",
    });
    return data;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
};

const getReportsDelegatedByMe = async () => {
  try {
    const data = await request("api/internal/delegated-reports", {
      method: "GET",
      useAuth: true,
      customErrorMap: {
        401: "Unauthorized",
        403: "Forbidden",
      },
      defaultErrorMessage: "Failed to fetch delegated reports",
    });
    return data;
  } catch (error) {
    console.error("Error fetching reports delegated by technical user:", error);
    throw error;
  }
};

const getReportComments = async (reportId) => {
  try {
    const data = await request(`api/internal/reports/${reportId}/comments`, {
      method: "GET",
      useAuth: true,
      customErrorMap: {
        400: "Invalid report ID",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Report not found",
      },
      defaultErrorMessage: "Failed to fetch comments",
    });
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const createComment = async (reportId, commentText) => {
  try {
    const data = await request(`api/internal/reports/${reportId}/comments`, {
      method: "POST",
      useAuth: true,
      body: { comment: commentText },
      customErrorMap: {
        400: "Invalid comment data",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Report not found",
      },
      defaultErrorMessage: "Failed to create comment",
    });
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const verifyEmail = async ({ email, code }) => {
  try {
    const data = await request("api/email-verification/verify", {
      method: "POST",
      useAuth: false,
      body: { email, code },
      customErrorMap: {
        400: "Invalid or expired verification code",
        404: "User not found",
      },
      defaultErrorMessage: "Email verification failed",
    });
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

const resendVerificationCode = async ({ email }) => {
  try {
    const data = await request("api/email-verification/resend", {
      method: "POST",
      useAuth: false,
      body: { email },
      customErrorMap: {
        400: "Unable to resend verification code",
        404: "User not found",
      },
      defaultErrorMessage: "Failed to resend verification code",
    });
    return data;
  } catch (error) {
    console.error("Error resending verification code:", error);
    throw error;
  }
};

const disableInternalUser = async (userId) => {
  try {
    await request(`api/admin/internal-users/${userId}`, {
      method: "DELETE",
      customErrorMap: {
        400: "Invalid user ID",
        403: "Attempted to delete own account",
        404: "User not found",
      },
      defaultErrorMessage: "Failed to delete internal user",
    });
    return true;
  } catch (error) {
    console.error("Error deleting internal user:", error);
    throw error;
  }
};

const API = {
  registerCitizen,
  loginCitizen,
  getAllInternalUsers,
  registerInternalUser,
  getUserInfo,
  logoutUser,
  loginInternalUser,
  updateInternalUserRole,
  getAllRoles,
  addNewReport,
  judgeReport,
  getAllCategories,
  uploadFile,
  deleteTempFile,
  getAllReportsIsPending,
  getCitizenReports,
  getReportsAssignedToMe,
  updateCitizenProfile,
  getAllCompanies,
  getCompaniesByCategory,
  delegateReportToCompany,
  updateReportStatus,
  getPublicReports,
  getReportMapDetails,
  getReportsDelegatedByMe,
  getReportComments,
  createComment,
  verifyEmail,
  resendVerificationCode,
  disableInternalUser,
};

export default API;
