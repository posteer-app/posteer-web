export default function Sidebar(){
    return(
        <div className="fixed left-0 px-4 py-[10rem]">
            {/* Blur background layer with fade-out */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-lg"
                style={{
                    mask: 'linear-gradient(to right, black 0%, black 0%, transparent 100%)',
                    WebkitMask: 'linear-gradient(to right, black 0%, black 0%, transparent 100%)'
                }}
            />
            {/* Sidebar content - always fully opaque */}
            <div className="relative h-full bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        {/* Sidebar content goes here */}
                        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                        <nav className="space-y-2">
                            <a href="#" className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                                Dashboard
                            </a>
                            <a href="#" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                                Analytics
                            </a>
                            <a href="#" className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                                Settings
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}