import fs from "fs";
import path from "path";

interface DocsConfig {
  navigation: {
    tabs: Array<{
      tab: string;
      pages?: string[];
      groups?: Array<{
        group: string;
        pages: Array<string | { group: string; pages: string[] }>;
      }>;
      versions?: Array<{
        version: string;
        openapi?: string;
        groups?: Array<{
          group: string;
          pages: string[];
        }>;
      }>;
    }>;
  };
}

function extractAllPages(config: DocsConfig): Set<string> {
  const pages = new Set<string>();

  function processPages(
    pageList: Array<
      | string
      | {
          group: string;
          pages: string[] | Array<string | { group: string; pages: string[] }>;
        }
    >,
  ): void {
    for (const item of pageList) {
      if (typeof item === "string") {
        pages.add(item);
      } else if (item.group && item.pages) {
        processPages(item.pages as any);
      }
    }
  }

  for (const tab of config.navigation.tabs) {
    if (tab.pages) {
      processPages(tab.pages as any);
    }

    if (tab.groups) {
      for (const group of tab.groups) {
        processPages(group.pages as any);
      }
    }

    if (tab.versions) {
      for (const version of tab.versions) {
        if (version.openapi) {
          pages.add(version.openapi.replace(/^\//, ""));
        }
        if (version.groups) {
          for (const group of version.groups) {
            processPages(group.pages as any);
          }
        }
      }
    }
  }

  return pages;
}

function validatePageExists(pagePath: string): boolean {
  // Check if the path already has a file extension (.json, .mdx, etc.)
  const ext = path.extname(pagePath);
  if (ext === ".json" || ext === ".mdx") {
    return fs.existsSync(pagePath);
  }

  // Otherwise check for .mdx or .json extensions
  const mdxPath = `${pagePath}.mdx`;

  return fs.existsSync(mdxPath);
}

async function main(): Promise<void> {
  try {
    const docsConfig: DocsConfig = JSON.parse(
      fs.readFileSync("docs.json", "utf8"),
    );
    const allPages = extractAllPages(docsConfig);

    console.log(`Found ${allPages.size} page references in docs.json`);

    const missingPages: string[] = [];
    const existingPages: string[] = [];

    for (const page of allPages) {
      if (validatePageExists(page)) {
        existingPages.push(page);
      } else {
        missingPages.push(page);
      }
    }

    console.log(`✅ ${existingPages.length} pages found`);

    if (missingPages.length > 0) {
      console.error(`❌ ${missingPages.length} missing pages:`);
      for (const page of missingPages.sort()) {
        console.error(`  - ${page}`);
      }
      process.exit(1);
    } else {
      console.log("🎉 All pages referenced in docs.json exist!");
    }
  } catch (error) {
    console.error("Error validating docs:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
