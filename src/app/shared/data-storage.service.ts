import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private firebaseUrl = 'https://recipe-book-angular-48cf1.firebaseio.com/';
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
    .put(
      `${this.firebaseUrl}recipes.json`,
      recipes,
    ).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(`${this.firebaseUrl}recipes.json`)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients || [] };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }),
      )
  }
}
