
import React, { useEffect, useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {

  const parsedHtml = useMemo(() => {
    // Configure marked to treat newlines as <br> tags, essential for chat-like formatting
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    // This is safe because we are only parsing text from our trusted AI model.
    return marked.parse(content || '');
  }, [content]);

  return (
    <div 
      className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2" 
      dangerouslySetInnerHTML={{ __html: parsedHtml as string }} 
    />
  );
};

export default MarkdownRenderer;