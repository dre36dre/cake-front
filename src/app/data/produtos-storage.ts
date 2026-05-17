import { Produto } from '../models/produto.model';
import { DEFAULT_PRODUCTS } from './default-products';

const STORAGE_KEY = 'leticia-luiz-produtos';

export function carregarProdutosSalvos(): Produto[] | null {
  if (!temLocalStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const produtos = JSON.parse(raw) as Produto[];
    return Array.isArray(produtos) ? produtos.map((produto) => ({ ...produto })) : null;
  } catch (error) {
    console.error('Erro ao carregar produtos salvos:', error);
    return null;
  }
}

export function salvarProdutosLocalmente(produtos: Produto[]): void {
  if (!temLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(produtos.map((produto) => ({ ...produto })))
  );
}

export function salvarProdutoLocalmente(produto: Produto): Produto {
  const produtos = carregarProdutosSalvos() ?? DEFAULT_PRODUCTS.map((item) => ({ ...item }));
  const produtoSalvo: Produto = {
    ...produto,
    id: produto.id ?? proximoId(produtos),
    name: produto.name.trim(),
    price: Number(produto.price || 0),
    imageUrl: produto.imageUrl?.trim() || null
  };
  const index = produtos.findIndex((item) => item.id === produtoSalvo.id);

  if (index >= 0) {
    produtos[index] = produtoSalvo;
  } else {
    produtos.push(produtoSalvo);
  }

  salvarProdutosLocalmente(produtos);
  return produtoSalvo;
}

export function removerProdutoLocalmente(produto: Produto): void {
  const produtos = carregarProdutosSalvos() ?? DEFAULT_PRODUCTS.map((item) => ({ ...item }));
  salvarProdutosLocalmente(produtos.filter((item) => item.id !== produto.id));
}

function proximoId(produtos: Produto[]): number {
  const ids = produtos
    .map((produto) => produto.id ?? 0)
    .filter((id) => Number.isFinite(id));

  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

function temLocalStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}
