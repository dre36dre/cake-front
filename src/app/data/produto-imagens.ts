import { Produto } from '../models/produto.model';

export const IMAGENS_POR_PRODUTO: Record<string, string> = {
  '100 brigadeiros recheados': 'brigadeiros-recheados.jpg',
  'brigadeiros recheados': 'brigadeiros-recheados.jpg',
  'brigadeiro recheado': 'brigadeiros-recheados.jpg',
  '100 brigadeiros': 'brigadeiros-tradicional.jpg',
  'brigadeiros': 'brigadeiros-tradicional.jpg',
  'brigadeiro': 'brigadeiros-tradicional.jpg',
  'beijinho': 'beijinho.JPG',
  'bolo': 'bolo.JPG',
  'bolo de coco': 'bolo.JPG',
  'bolo de pote': 'bolo-pote.JPG',
  'copo surpresa': 'copo-surpresa.JPG',
  'mini pudim': 'mini-pudim.JPG',
  'mousse': 'mousse.jpg',
  'pudim 2': 'pudim-2.JPG',
  'pudim para compartilhar': 'pudim-compartilhar.JPG',
  'pudim familia': 'pudim.JPG',
  'pudim família': 'pudim.JPG',
  'trufas': 'trufas.JPG'
};

export function imagemLocalPorProduto(produto: Produto): string {
  const nome = produto.name?.trim().toLowerCase() ?? '';
  const imagem = IMAGENS_POR_PRODUTO[nome];

  return assetPath(imagem ?? 'bolo.JPG');
}

export function assetPath(imagem: string): string {
  if (imagem.startsWith('cardapio-')) {
    return `assets/imagenshome/${imagem}`;
  }

  if (imagem.startsWith('assets/')) {
    return imagem;
  }

  return `assets/imagens/${imagem}`;
}
