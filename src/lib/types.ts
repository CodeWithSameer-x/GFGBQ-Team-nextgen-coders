export type Resource = {
  name: string;
  description: string;
  address: string;
  contact: string;
  eligibility: string;
};

export type Bookmark = Resource & {
  id: string; // generated from resource name and address
  status: 'Not Started' | 'In Progress' | 'Completed';
};
