/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './landing.module.css';
import { Briefcase, BarChart3, Layout, Zap, Check, X, Minus } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Briefcase color="var(--accent-primary)" />
          Nexus
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#compare" className={styles.navLink}>Compare</a>
          <a href="#pricing" className={styles.navLink}>Pricing</a>
        </div>
        <div>
          <Link href="/login" className={styles.ctaButton}>Sign In</Link>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroGlow}></div>
          <h1 className="animate-fade-in-up">Stop tracking your career in spreadsheets.</h1>
          <p className="animate-fade-in-up delay-100">
            Nexus is the ultimate job application pipeline. Organize, track, and analyze your job search with a beautiful, commercial-grade CRM designed specifically for tech professionals.
          </p>
          <div className={`${styles.heroButtons} animate-fade-in-up delay-200`}>
            <Link href="/login" className={styles.primaryCta}>Get Started for Free</Link>
            <a href="#features" className={styles.secondaryCta}>See how it works</a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className={styles.section}>
          <div className={styles.sectionTitle}>
            <h2 className="animate-fade-in-up delay-100">Built for high-achievers</h2>
            <p className="animate-fade-in-up delay-200">Everything you need to turn your job search into a predictable, data-driven system.</p>
          </div>
          
          <div className={`${styles.featuresGrid} animate-fade-in-up delay-300`}>
            <div className={`glass ${styles.featureCard}`}>
              <div className={styles.featureIcon}><Layout size={24} /></div>
              <h3>Visual Kanban Board</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Drag and drop your applications from "Wishlist" to "Offer". See your entire pipeline at a single glance.</p>
            </div>
            <div className={`glass ${styles.featureCard}`}>
              <div className={styles.featureIcon}><BarChart3 size={24} /></div>
              <h3>Data-Driven Metrics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Track your conversion rates and interview frequency with beautiful, interactive Recharts integrations.</p>
            </div>
            <div className={`glass ${styles.featureCard}`}>
              <div className={styles.featureIcon}><Zap size={24} /></div>
              <h3>Automated Branding</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We automatically fetch official company logos (via logo.dev) as soon as you type the name. It just works.</p>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section id="compare" className={styles.section}>
          <div className={styles.sectionTitle}>
            <h2>Why Nexus wins</h2>
            <p>See how we stack up against the tools you're probably forcing to do this job right now.</p>
          </div>

          <div className={`${styles.comparisonTable} animate-fade-in-up`}>
            <div className={`${styles.tableRow} ${styles.tableHeader}`}>
              <div className={styles.colFeature}>Feature</div>
              <div className={styles.colCompetitor}>Excel / Sheets</div>
              <div className={styles.colCompetitor}>Trello</div>
              <div className={styles.colCompetitor}>Notion</div>
              <div className={styles.colNexus}>Nexus CRM</div>
            </div>
            
            <div className={styles.tableRow}>
              <div className={styles.colFeature}>Purpose-built for Job Hunt</div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colNexus}><Check className={styles.check} size={20} /></div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.colFeature}>Drag & Drop Pipeline</div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><Check className={styles.check} size={18} /></div>
              <div className={styles.colCompetitor}><Check className={styles.check} size={18} /></div>
              <div className={styles.colNexus}><Check className={styles.check} size={20} /></div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.colFeature}>Automated Company Logos</div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><Minus className={styles.dash} size={18} /></div>
              <div className={styles.colNexus}><Check className={styles.check} size={20} /></div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.colFeature}>Built-in Conversion Analytics</div>
              <div className={styles.colCompetitor}><Minus className={styles.dash} size={18} /></div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colCompetitor}><X className={styles.cross} size={18} /></div>
              <div className={styles.colNexus}><Check className={styles.check} size={20} /></div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className={styles.section}>
          <div className={styles.sectionTitle}>
            <h2>Simple, transparent pricing</h2>
            <p>Start for free, upgrade when your search gets serious.</p>
          </div>

          <div className={`${styles.pricingGrid} animate-fade-in-up`}>
            <div className={`glass ${styles.pricingCard}`}>
              <h3>Intern Edition</h3>
              <div className={styles.price}>$0<span>/mo</span></div>
              <p style={{ color: 'var(--text-secondary)' }}>Perfect for students and interns applying to their first few roles.</p>
              <div className={styles.pricingList}>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Up to 50 active applications</div>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Basic Kanban Board</div>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Local data storage</div>
              </div>
              <Link href="/login" className={styles.secondaryCta} style={{ textAlign: 'center', marginTop: '1rem' }}>Start Free</Link>
            </div>

            <div className={`glass ${styles.pricingCard} ${styles.pricingPro}`}>
              <h3>Senior Dev Pro</h3>
              <div className={styles.price}>$9<span>/mo</span></div>
              <p style={{ color: 'var(--text-secondary)' }}>For the aggressive job hunter aiming for FAANG/MAMAA companies.</p>
              <div className={styles.pricingList}>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Unlimited applications</div>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Advanced analytics & charts</div>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Automated logo fetching</div>
                <div className={styles.pricingItem}><Check size={16} color="var(--accent-primary)" /> Interview prep notes</div>
              </div>
              <Link href="/login" className={styles.primaryCta} style={{ textAlign: 'center', marginTop: '1rem' }}>Upgrade to Pro</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>&copy; 2026 Nexus CRM. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#" className={styles.navLink}>Privacy</a>
          <a href="#" className={styles.navLink}>Terms</a>
        </div>
      </footer>
    </div>
  );
}
