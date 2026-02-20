export interface ImageItem {
  url: string;
  file?: File;
  preview?: string;
  isNew?: boolean;
}

export interface BatchItem {
  id: string;
  file: File;
  preview: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  stockOverride: string;
  expanded: boolean;
  nameError: boolean;
  priceError: boolean;
}
