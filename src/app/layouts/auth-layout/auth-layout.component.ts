import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { tsParticles, type ISourceOptions, type Container } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, LanguageSwitcherComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent implements AfterViewInit, OnDestroy {
  private particlesContainer?: Container;

  async ngAfterViewInit() {
    await loadFull(tsParticles);
    this.particlesContainer = await tsParticles.load({ id: 'auth-particles', options: this.particlesOptions });
  }

  ngOnDestroy() {
    this.particlesContainer?.destroy();
  }

  private particlesOptions: ISourceOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    particles: {
      number: { value: 80, density: { enable: true } },
      color: { value: ['#E6801A', '#E65A1A', '#FFD699', '#FFE5CC', '#FFFFFF'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.6,
        animation: {
          enable: true,
          speed: 3,
          sync: false
        }
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 2,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        outModes: { default: 'out' },
        attract: { enable: true, rotate: { x: 600, y: 600 } }
      },
      links: {
        enable: true,
        distance: 120,
        color: '#E6801A',
        opacity: 0.2,
        width: 1
      }
    },
    detectRetina: true
  };
} 