import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Aviss, AvisService } from './avis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

   avisList: Aviss[] = [];
  form: Aviss = { nom: '', message: '', note: 5 };
  editingId: number | null = null;   // null = mode création
  loading = false;
  error = '';

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(): void {
    this.avisService.getAvis().subscribe({
      next: data => this.avisList = data,
      error: () => this.error = 'Erreur de chargement'
    });
  }

  submit(): void {
    if (!this.form.nom.trim() || !this.form.message.trim()) return;

    this.loading = true;
    this.error = '';

    if (this.editingId !== null) {
      // ---------- MODE ÉDITION ----------
      this.avisService.updateAvis(this.editingId, this.form).subscribe({
        next: updated => {
          const i = this.avisList.findIndex(a => a.id === updated.id);
          if (i !== -1) this.avisList[i] = updated;
          this.resetForm();
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      // ---------- MODE CRÉATION ----------
      this.avisService.addAvis(this.form).subscribe({
        next: created => {
          this.avisList.unshift(created);
          this.resetForm();
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur lors de l’envoi';
          this.loading = false;
        }
      });
    }
  }

  editer(avis: Aviss): void {
    this.editingId = avis.id!;
    this.form = { nom: avis.nom, message: avis.message, note: avis.note };
  }

  annulerEdition(): void {
    this.resetForm();
  }

  supprimer(avis: Aviss): void {
    if (!confirm(`Supprimer l’avis de ${avis.nom} ?`)) return;

    this.avisService.deleteAvis(avis.id!).subscribe({
      next: () => {
        this.avisList = this.avisList.filter(a => a.id !== avis.id);
        if (this.editingId === avis.id) this.resetForm();
      },
      error: () => this.error = 'Erreur lors de la suppression'
    });
  }

  private resetForm(): void {
    this.form = { nom: '', message: '', note: 5 };
    this.editingId = null;
  }
}
