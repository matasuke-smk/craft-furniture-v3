/**
 * Link Checker for Craft Furniture Website
 * Validates internal links and generates report
 */

const fs = require('fs').promises;
const path = require('path');

class LinkChecker {
    constructor() {
        this.baseDir = __dirname;
        this.htmlFiles = [];
        this.allLinks = [];
        this.brokenLinks = [];
        this.externalLinks = [];
        this.results = {
            total: 0,
            working: 0,
            broken: 0,
            external: 0
        };
    }

    async run() {
        console.log('🔍 Starting Link Check for Craft Furniture Website...\n');
        
        try {
            await this.findHtmlFiles();
            await this.extractAllLinks();
            await this.validateLinks();
            this.generateReport();
        } catch (error) {
            console.error('❌ Error during link checking:', error);
        }
    }

    async findHtmlFiles() {
        const findFiles = async (dir) => {
            const items = await fs.readdir(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = await fs.stat(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    await findFiles(fullPath);
                } else if (item.endsWith('.html')) {
                    this.htmlFiles.push(fullPath);
                }
            }
        };

        await findFiles(this.baseDir);
        console.log(`📄 Found ${this.htmlFiles.length} HTML files`);
    }

    async extractAllLinks() {
        for (const file of this.htmlFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.baseDir, file);
            
            // Extract href attributes from links
            const linkRegex = /href=["']([^"']*)["']/g;
            let match;
            
            while ((match = linkRegex.exec(content)) !== null) {
                const href = match[1];
                
                // Skip non-navigational links
                if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                    continue;
                }
                
                this.allLinks.push({
                    source: relativePath,
                    href: href,
                    isExternal: href.startsWith('http'),
                    resolvedPath: this.resolvePath(file, href)
                });
            }

            // Extract src attributes from images
            const imgRegex = /src=["']([^"']*\.(?:jpg|jpeg|png|gif|webp|svg))["']/g;
            while ((match = imgRegex.exec(content)) !== null) {
                const src = match[1];
                
                if (!src.startsWith('http') && !src.startsWith('data:')) {
                    this.allLinks.push({
                        source: relativePath,
                        href: src,
                        isExternal: false,
                        resolvedPath: this.resolvePath(file, src),
                        type: 'image'
                    });
                }
            }
        }
        
        this.results.total = this.allLinks.length;
        console.log(`🔗 Found ${this.allLinks.length} total links`);
    }

    resolvePath(sourceFile, href) {
        if (href.startsWith('/')) {
            return path.join(this.baseDir, href.substring(1));
        }
        
        const sourceDir = path.dirname(sourceFile);
        return path.resolve(sourceDir, href);
    }

    async validateLinks() {
        for (const link of this.allLinks) {
            if (link.isExternal) {
                this.externalLinks.push(link);
                this.results.external++;
                continue;
            }
            
            try {
                await fs.access(link.resolvedPath);
                this.results.working++;
            } catch (error) {
                this.brokenLinks.push({
                    ...link,
                    error: error.message
                });
                this.results.broken++;
            }
        }
    }

    generateReport() {
        console.log('\n📊 LINK CHECK REPORT');
        console.log('='.repeat(50));
        console.log(`Total Links Checked: ${this.results.total}`);
        console.log(`✅ Working Links: ${this.results.working}`);
        console.log(`❌ Broken Links: ${this.results.broken}`);
        console.log(`🌐 External Links: ${this.results.external}`);
        console.log(`Success Rate: ${((this.results.working / (this.results.total - this.results.external)) * 100).toFixed(1)}%`);

        if (this.brokenLinks.length > 0) {
            console.log('\n❌ BROKEN LINKS:');
            console.log('-'.repeat(30));
            
            this.brokenLinks.forEach((link, index) => {
                console.log(`${index + 1}. ${link.source}`);
                console.log(`   Link: ${link.href}`);
                console.log(`   Type: ${link.type || 'page'}`);
                console.log(`   Error: ${link.error}`);
                console.log('');
            });

            // Generate suggested fixes
            this.generateSuggestions();
        } else {
            console.log('\n🎉 No broken links found!');
        }

        if (this.externalLinks.length > 0) {
            console.log(`\n🌐 EXTERNAL LINKS (${this.externalLinks.length}):`);
            console.log('-'.repeat(30));
            
            const uniqueExternalDomains = [...new Set(this.externalLinks.map(link => {
                try {
                    return new URL(link.href).hostname;
                } catch {
                    return link.href;
                }
            }))];

            uniqueExternalDomains.forEach(domain => {
                const count = this.externalLinks.filter(link => {
                    try {
                        return new URL(link.href).hostname === domain;
                    } catch {
                        return link.href === domain;
                    }
                }).length;
                console.log(`  ${domain} (${count} links)`);
            });
        }

        // Save detailed report to file
        this.saveDetailedReport();
    }

    generateSuggestions() {
        console.log('\n💡 SUGGESTED FIXES:');
        console.log('-'.repeat(30));
        
        const missingFiles = new Set();
        const invalidPaths = new Set();

        this.brokenLinks.forEach(link => {
            const fileName = path.basename(link.resolvedPath);
            const dirName = path.dirname(link.resolvedPath);
            
            if (link.error.includes('ENOENT')) {
                if (fileName.includes('.')) {
                    missingFiles.add(fileName);
                } else {
                    invalidPaths.add(link.href);
                }
            }
        });

        if (missingFiles.size > 0) {
            console.log('📄 Missing Files:');
            missingFiles.forEach(file => {
                console.log(`  • Create: ${file}`);
            });
            console.log('');
        }

        if (invalidPaths.size > 0) {
            console.log('🔗 Invalid Paths:');
            invalidPaths.forEach(path => {
                console.log(`  • Fix path: ${path}`);
            });
            console.log('');
        }

        console.log('🛠️ Quick Fixes:');
        console.log('  • Check for typos in file paths');
        console.log('  • Ensure all referenced images exist');
        console.log('  • Verify directory structure');
        console.log('  • Update links after file moves/renames');
    }

    async saveDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results,
            brokenLinks: this.brokenLinks,
            externalLinks: this.externalLinks.map(link => ({
                source: link.source,
                href: link.href
            }))
        };

        try {
            await fs.writeFile('link-check-report.json', JSON.stringify(report, null, 2));
            console.log('\n📝 Detailed report saved to: link-check-report.json');
        } catch (error) {
            console.error('Failed to save detailed report:', error);
        }
    }
}

// Run the link checker if this file is executed directly
if (require.main === module) {
    const checker = new LinkChecker();
    checker.run();
}

module.exports = LinkChecker;