import { useAuth } from '@/app/modules/auth';
import { FILE_URL, requestGET, requestGETAttachment, requestPOSTAttachment } from './baseAPI';
import _ from 'lodash';
import { TDUploadFile } from '@/models/TDUploadFile';

const URL_REGEX =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => URL_REGEX.test(path);

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const CheckRole = (roles?: string[], role?: string[]): boolean => {
  if (!roles?.length) return false;
  return roles.some(v => role?.includes(v));
};

export const CheckPermissions = (permissions: string[]): boolean => {
  const { currentUser } = useAuth();
  const currentPermissions = currentUser?.permissions;
  if (!currentPermissions?.length) return false;
  return currentPermissions.some(v => permissions.includes(v));
};

interface AttachmentResponse {
  data: {
    data: BlobPart;
  };
}

export const downloadDocumentAttachment = async (fileName: string): Promise<void> => {
  try {
    const res = await requestGETAttachment(`api/v1/documentattachments/${fileName}`);
    const fileData = new Blob([res?.data?.data]);
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(fileData);
    downloadLink.download = fileName.substring(fileName.lastIndexOf('/') + 1);
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href); // Cleanup
  } catch (error) {
    console.error('Lỗi khi download file:', error);
  }
};

export const downloadAttachment = async (fileName) => {
  try {
    // Tải file từ URL tạm thời
    const fileResponse = await fetch(`${FILE_URL}${fileName}`);
    const blob = await fileResponse.blob();

    // Tạo liên kết tải xuống
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = getFileName(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Lỗi khi download file:", error);
  }
};

export const getFileName = (path) => {
  const fileNameIndex = path.lastIndexOf("/");
  if (fileNameIndex !== -1) {
    return path.slice(fileNameIndex + 1);
  }
  return "";
};

export const downloadReport = async (data) => {
  try {
    const res = await requestPOSTAttachment(`api/v1/dashboardbaocao/baocao/download`, data);
    const contentDisposition = res!.headers["content-disposition"];
    let fileName = "default-attachment.xlsx";
    if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        contentDisposition
      );
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }
    const fileData = new Blob([res!.data]);
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(fileData);
    downloadLink.download = fileName;
    downloadLink.click();
  } catch (error) {
    console.error("Lỗi khi download file:", error);
  }
};

export const handleFiles = (files: TDUploadFile[]): string[] => {
  return files
    .map(file => {
      if (file.response?.data?.[0]?.url) {
        return file.response.data[0].url;
      }
      return file.path || '';
    })
    .filter(Boolean);
};

/**
 * Chuyển đổi chuỗi đường dẫn ảnh thành mảng đối tượng TDUploadFile
 * @param values - Chuỗi đường dẫn ảnh, phân tách bởi '##'
 * @param baseURL - URL cơ sở để tạo đường dẫn đầy đủ
 * @returns Mảng các đối tượng TDUploadFile
 */
export const handleImage = (values: string, baseURL: string): TDUploadFile[] => {
  const arr = _.without(_.split(values, '##'), '');
  return arr.map(path => {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const isExternalUrl = cleanPath.includes('https://') || cleanPath.includes('http://');
    return {
      type: 'image',
      size: 0,
      uid: _.uniqueId(),
      url: isExternalUrl ? cleanPath : `${baseURL}${cleanPath}`,
      path: cleanPath,
      name: cleanPath.substring(cleanPath.lastIndexOf('/') + 1),
    };
  });
};



interface ImageElement {
  response?: {
    data: Array<{ url: string }>;
  };
  path?: string;
}

export const convertImage = (array: ImageElement[]): string => {
  const urls = array.map(element => element?.response?.data[0]?.url ?? element.path);
  return _.uniq(urls).join('##');
};

const VIETNAMESE_MAP = {
  from: 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;',
  to: 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------',
};

export const toSlug = (str: string): string => {
  if (!str) return '';

  let result = str.trim().toLowerCase();

  // Replace Vietnamese characters
  for (let i = 0; i < VIETNAMESE_MAP.from.length; i++) {
    result = result.replace(new RegExp(VIETNAMESE_MAP.from.charAt(i), 'g'), VIETNAMESE_MAP.to.charAt(i));
  }

  return result
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const removeAccents = (str: string): string => {
  if (!str) return '';

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9 -]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .toUpperCase();
};

export const handleKeyDownNumber = (e: any, value: any) => {
  const char = e.key;

  if (!/[0-9,]/.test(char) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
    e.preventDefault();
  }

  if (char === ',' && value.includes(',')) {
    e.preventDefault();
  }
};

export const stringNToFloat = (input: string) => {
  return (input && parseFloat(input.replace(/,/g, '.'))) ?? 0;
};
