export type ProjectCategory = 'web' | 'mobile' | 'cloud';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
}

export interface TranslatedProject extends Omit<Project, 'id'> {}

export interface PortfolioState {
  selectedCategory: 'all' | ProjectCategory;
  projects: Project[];
}
