export interface TechStackCategory {
  title: string;
  items: string[];
}

export const techStackData: TechStackCategory[] = [
  {
    title: 'Programming',
    items: ['TypeScript', 'Python', 'Bash', 'Java', 'C++'],
  },

  {
    title: 'Hyperscalers',
    items: ['AWS', 'Azure', 'GCP'],
  },

  {
    title: 'AI, ML, and LLM',
    items: ['Agentic AI', 'Generative AI', 'AI Assisted Programming', 'Finetuning', 'OpenRouter'],
  },

  {
    title: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'SQLite', 'Firestore'],
  },

  {
    title: 'DevOps',
    items: ['Ansible', 'Puppet', 'Chef', 'Terraform', 'Helm', 'Docker'],
  },
];
