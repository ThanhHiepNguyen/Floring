function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function inlineFormat(s: string) {
  // Bold: **text**
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function markdownToHtml(markdown: string) {
  const src = markdown.replace(/\r\n/g, '\n');
  const lines = src.split('\n');

  const h1Class = 'mt-6 text-3xl font-bold tracking-tight text-zinc-900';
  const h2Class = 'mt-10 text-2xl font-semibold text-zinc-900';
  const h3Class = 'mt-8 text-xl font-semibold text-zinc-900';
  const pClass = 'mt-4 leading-relaxed text-zinc-700';
  const ulClass = 'mt-4 list-disc space-y-2 pl-6 text-zinc-700';
  const olClass = 'mt-4 list-decimal space-y-2 pl-6 text-zinc-700';
  const liClass = 'leading-relaxed';

  const out: string[] = [];
  let paragraph: string[] = [];
  let listMode: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = inlineFormat(escapeHtml(paragraph.join(' ').trim()));
    if (text) out.push(`<p class="${pClass}">${text}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listMode) return;
    const itemsHtml = listItems
      .map((it) => `<li class="${liClass}">${it}</li>`)
      .join('');
    out.push(
      listMode === 'ul'
        ? `<ul class="${ulClass}">${itemsHtml}</ul>`
        : `<ol class="${olClass}">${itemsHtml}</ol>`,
    );
    listMode = null;
    listItems = [];
  };

  const pushHeading = (level: 1 | 2 | 3, text: string) => {
    flushParagraph();
    flushList();
    const plain = text.trim();
    const safe = inlineFormat(escapeHtml(plain));
    if (!safe) return;
    const cls = level === 1 ? h1Class : level === 2 ? h2Class : h3Class;
    const id = slugifyHeading(plain);
    out.push(`<h${level} id="${id}" class="${cls} scroll-mt-28">${safe}</h${level}>`);
  };

  const pushImage = (src: string, alt: string) => {
    flushParagraph();
    flushList();
    const safeSrc = escapeHtml(src.trim());
    const safeAlt = escapeHtml(alt.trim());
    out.push(
      `<figure class="mt-6 overflow-hidden rounded-2xl"><img src="${safeSrc}" alt="${safeAlt}" class="w-full rounded-2xl" loading="lazy" /></figure>`,
    );
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    const rawImg = line.match(/^<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>$/i);
    if (rawImg) {
      pushImage(rawImg[1], '');
      continue;
    }

    const mdImg = line.match(/^!\[(.*)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdImg) {
      pushImage(mdImg[2], mdImg[1]);
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      pushHeading(3, h3[1]);
      continue;
    }
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      pushHeading(2, h2[1]);
      continue;
    }
    const h1 = line.match(/^#\s+(.*)$/);
    if (h1) {
      pushHeading(1, h1[1]);
      continue;
    }

    const ul = line.match(/^\-\s+(.*)$/);
    if (ul) {
      flushParagraph();
      if (listMode !== 'ul') {
        flushList();
        listMode = 'ul';
      }
      const safe = inlineFormat(escapeHtml(ul[1].trim()));
      listItems.push(safe);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      flushParagraph();
      if (listMode !== 'ol') {
        flushList();
        listMode = 'ol';
      }
      const safe = inlineFormat(escapeHtml(ol[1].trim()));
      listItems.push(safe);
      continue;
    }

    // normal line => paragraph
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return out.join('');
}

