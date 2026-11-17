import { secureStorageService } from '../storage/secure-store.storage';
import { insforge } from '../api/insforge';
import type { SubjectsPage } from '../interfaces/subject.interface';

export const SUBJECTS_PAGE_SIZE = 6;

export const getSubjectsPage = async (
  page: number,
  pageSize = SUBJECTS_PAGE_SIZE,
): Promise<SubjectsPage> => {
  const accessToken = await secureStorageService.getItem('token');

  if (!accessToken) {
    throw new Error('No hay una sesión activa para cargar los subjects.');
  }

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  insforge.setAccessToken(accessToken);

  const { data, count, error } = await insforge.database
    .from('subjects')
    .select('id, name', { count: 'exact' })
    .order('name', { ascending: true })
    .order('id', { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data ?? [],
    count: count ?? 0,
  };
};
