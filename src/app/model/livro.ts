import { Autor } from './autor';
export interface Livro { id: number; titulo: string; isbn?: string | null; anoPublicacao?: number | null; autores: Autor[]; }
export type LivroRequest = Omit<Livro, 'id' | 'autores'> & { autores: Pick<Autor, 'id'>[] };
