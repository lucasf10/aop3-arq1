import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Posto {
  id: number;
  nome: string;
  endereco: string;
  bairro: string;
  bandeira: string;
}

export interface Combustivel {
  id: number;
  nome: string;
}

export interface Preco {
  id: number;
  preco: number;
  data: string;
  data_coleta: string;
  posto_id: number;
  posto: string;
  bairro: string;
  bandeira: string;
  combustivel_id: number;
  combustivel: string;
}

export interface MinMaxPreco {
  combustivel: string;
  menor_preco: number;
  maior_preco: number;
}

export interface MediaAmostra {
  posto_id?: number;
  posto: string;
  bairro: string;
  combustivel_id?: number;
  combustivel: string;
  media: number;
  quantidade: number;
}

export interface PrecoRecente {
  posto_id: number;
  posto: string;
  bairro: string;
  bandeira: string;
  combustivel_id: number;
  combustivel: string;
  preco: number;
  data_coleta: string;
}

export interface HistoricoPreco {
  posto_id: number;
  posto: string;
  combustivel_id: number;
  combustivel: string;
  preco: number;
  data_coleta: string;
}

export interface Estatisticas {
  totalPostos: number;
  totalCombustiveis: number;
  totalAmostras: number;
  totalBairros: number;
}

export interface ConsultasData {
  minmax: MinMaxPreco[];
  media: MediaAmostra[];
  recentes: PrecoRecente[];
  historico: HistoricoPreco[];
  estatisticas: Estatisticas;
}

export function usePostos() {
  const { data, error, isLoading } = useSWR<Posto[]>("/api/postos", fetcher);
  return { postos: data, error, isLoading };
}

export function useCombustiveis() {
  const { data, error, isLoading } = useSWR<Combustivel[]>(
    "/api/combustiveis",
    fetcher,
  );
  return { combustiveis: data, error, isLoading };
}

export function usePrecos() {
  const { data, error, isLoading } = useSWR<Preco[]>("/api/precos", fetcher);
  return { precos: data, error, isLoading };
}

export function useConsultas() {
  const { data, error, isLoading } = useSWR<ConsultasData>(
    "/api/consultas",
    fetcher,
  );
  return { consultas: data, error, isLoading };
}

export function useMinMaxPrecos() {
  const { data, error, isLoading } = useSWR<MinMaxPreco[]>(
    "/api/consultas?tipo=minmax",
    fetcher,
  );
  return { minmax: data, error, isLoading };
}

export function useMediaAmostras() {
  const { data, error, isLoading } = useSWR<MediaAmostra[]>(
    "/api/consultas?tipo=media",
    fetcher,
  );
  return { media: data, error, isLoading };
}

export function usePrecosRecentes() {
  const { data, error, isLoading } = useSWR<PrecoRecente[]>(
    "/api/consultas?tipo=recentes",
    fetcher,
  );
  return { recentes: data, error, isLoading };
}

export function useHistoricoPrecos() {
  const { data, error, isLoading } = useSWR<HistoricoPreco[]>(
    "/api/consultas?tipo=historico",
    fetcher,
  );
  return { historico: data, error, isLoading };
}

export function useEstatisticas() {
  const { data, error, isLoading } = useSWR<Estatisticas>(
    "/api/consultas?tipo=estatisticas",
    fetcher,
  );
  return { estatisticas: data, error, isLoading };
}

export interface BairroOption {
  id: number;
  nome: string;
}

export function useBairros() {
  const { data, error, isLoading } = useSWR<BairroOption[]>(
    "/api/bairros",
    fetcher,
  );
  return { bairros: data, error, isLoading };
}
