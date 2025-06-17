/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",], theme: {
    	extend: {
    		colors: {
    			linkoo: {
    				'50': '#f0f9ff',
    				'100': '#e0f2fe',
    				'200': '#bae6fd',
    				'300': '#7dd3fc',
    				'400': '#38bdf8',
    				'500': '#0ea5e9',
    				'600': '#0284c7',
    				'700': '#0369a1',
    				'800': '#075985',
    				'900': '#0c4a6e',
    				'950': '#082f49'
    			},
    			accent: {
    				'50': '#fdf4ff',
    				'100': '#fae8ff',
    				'200': '#f5d0fe',
    				'300': '#f0abfc',
    				'400': '#e879f9',
    				'500': '#d946ef',
    				'600': '#c026d3',
    				'700': '#a21caf',
    				'800': '#86198f',
    				'900': '#701a75',
    				'950': '#4a044e',
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			success: {
    				'50': '#f0fdf4',
    				'100': '#dcfce7',
    				'200': '#bbf7d0',
    				'300': '#86efac',
    				'400': '#4ade80',
    				'500': '#22c55e',
    				'600': '#16a34a',
    				'700': '#15803d',
    				'800': '#166534',
    				'900': '#14532d',
    				'950': '#052e16'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		backgroundImage: {
    			'gradient-linkoo': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    			'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    			'gradient-ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    			'gradient-forest': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    			'gradient-fire': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    			'gradient-space': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    			'gradient-night': 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
    			'gradient-royal': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			display: [
    				'Cal Sans',
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			mono: [
    				'JetBrains Mono',
    				'Fira Code',
    				'monospace'
    			]
    		},
    		animation: {
    			'fade-in': 'fadeIn 0.5s ease-in-out',
    			'slide-up': 'slideUp 0.3s ease-out',
    			'scale-in': 'scaleIn 0.2s ease-out',
    			'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
    			'gradient-shift': 'gradientShift 3s ease-in-out infinite',
    			float: 'float 3s ease-in-out infinite'
    		},
    		keyframes: {
    			fadeIn: {
    				'0%': {
    					opacity: '0'
    				},
    				'100%': {
    					opacity: '1'
    				}
    			},
    			slideUp: {
    				'0%': {
    					transform: 'translateY(20px)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			scaleIn: {
    				'0%': {
    					transform: 'scale(0.9)',
    					opacity: '0'
    				},
    				'100%': {
    					transform: 'scale(1)',
    					opacity: '1'
    				}
    			},
    			bounceSubtle: {
    				'0%, 20%, 50%, 80%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'40%': {
    					transform: 'translateY(-5px)'
    				},
    				'60%': {
    					transform: 'translateY(-3px)'
    				}
    			},
    			gradientShift: {
    				'0%, 100%': {
    					backgroundPosition: '0% 50%'
    				},
    				'50%': {
    					backgroundPosition: '100% 50%'
    				}
    			},
    			float: {
    				'0%, 100%': {
    					transform: 'translateY(0px)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				}
    			}
    		},
    		boxShadow: {
    			card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    			'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    			glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    			glow: '0 0 20px rgba(103, 126, 234, 0.5)',
    			'glow-accent': '0 0 20px rgba(212, 70, 239, 0.5)'
    		},
    		backdropBlur: {
    			xs: '2px'
    		},
    		transitionDuration: {
    			'400': '400ms',
    			'600': '600ms'
    		},
    		spacing: {
    			'18': '4.5rem',
    			'88': '22rem',
    			'128': '32rem'
    		},
    		borderRadius: {
    			xl: '1rem',
    			'2xl': '1.5rem',
    			'3xl': '2rem',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    }, plugins: [// Плагин для анимаций
        function ({addUtilities}) {
            addUtilities({
                '.glass': {
                    'background': 'rgba(255, 255, 255, 0.1)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.2)',
                }, '.glass-dark': {
                    'background': 'rgba(0, 0, 0, 0.1)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                }, '.text-gradient': {
                    'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                }, '.bg-animate': {
                    'background-size': '200% 200%', 'animation': 'gradientShift 3s ease-in-out infinite',
                },
            })
        },
        require("tailwindcss-animate")
    ],
}
