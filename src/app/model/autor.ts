export interface Autor { id: number; nome: string; nacionalidade?: string | null; biografia?: string | null; }
export type NovoAutor = Omit<Autor, 'id'>;
