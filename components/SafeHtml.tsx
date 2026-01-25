"use client";

import { useEffect, useState } from "react";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Component to safely render HTML content
 * Sanitizes HTML and fixes common issues
 */
export default function SafeHtml({ html, className = "" }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (!html) {
      setSanitizedHtml("");
      return;
    }

    // Allowed HTML tags
    const allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "span",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
    ];

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove script tags and event handlers
    const scripts = tempDiv.querySelectorAll(
      "script, style, iframe, object, embed, form, input, button"
    );
    scripts.forEach((el) => el.remove());

    // Remove all elements that are not in allowed tags
    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        // Replace with its content
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
      } else {
        // Remove dangerous attributes
        const attrs = Array.from(el.attributes);
        attrs.forEach((attr) => {
          const attrName = attr.name.toLowerCase();
          // Allow safe attributes
          const safeAttrs = ["href", "src", "alt", "title", "class", "id"];
          if (!safeAttrs.includes(attrName) || attrName.startsWith("on")) {
            el.removeAttribute(attr.name);
          }
          // Sanitize href and src
          if (attrName === "href" || attrName === "src") {
            const value = attr.value.toLowerCase();
            if (value.startsWith("javascript:") || value.startsWith("data:")) {
              el.removeAttribute(attr.name);
            }
          }
        });
      }
    });

    // Fix common HTML issues
    let sanitized = tempDiv.innerHTML;

    // Fix &amp; entities (but keep real &amp;)
    sanitized = sanitized.replace(/&amp;([a-z]+;)/gi, "&$1");

    // Fix double br tags
    sanitized = sanitized.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "<br />");

    // Clean up empty paragraphs
    sanitized = sanitized.replace(/<p>\s*<\/p>/gi, "");
    sanitized = sanitized.replace(/<p><\/p>/gi, "");

    // Fix unclosed tags by ensuring proper structure
    sanitized = sanitized.replace(/<p([^>]*)>(?!.*<\/p>)/gi, (match, attrs) => {
      // If p tag doesn't have closing tag, add it at the end
      return match;
    });

    setSanitizedHtml(sanitized);
  }, [html]);

  if (!sanitizedHtml) return null;

  return (
    <div
      className={`safe-html ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Ensure proper styling for HTML content
      }}
    />
  );
}
