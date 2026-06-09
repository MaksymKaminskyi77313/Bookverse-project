# Bookverse-project
O projekcie:
BookVerse to aplikacja internetowa inspirowana popularnymi platformami dla miłośników literatury (takimi jak Lubimyczytać). Projekt powstał w ramach przedmiotu "Wprowadzenie do technologii internetowych" i jest kompletnym rozwiązaniem full-stack. Prezentuje nowoczesny frontend, integrację z bazą danych przez API, system uwierzytelniania użytkowników oraz panel administracyjny.

BookVerse pozwala użytkownikom przeglądać katalog książek, sprawdzać szczegółowe informacje o tytułach, zarządzać własną "półką" (koszykiem czytelnika), odkrywać profile autorów oraz wchodzić w interakcję z platformą za pomocą intuicyjnego interfejsu.

Architekturza aplikacji:
 Frontend: HTML, CSS, JavaScript
 Backend: Spring Boot (Java)
 Baza danych: PostgreSQL
 Hosting: Vercel (Frontend), Render (Backend), Neon PostgreSQL (Baza danych)
 
Główne funkcje projektu:

1) Katalog książek
Użytkownicy mogą:
 1 Przeglądać pełną listę książek, nowości, bestsellery.
 2 Wyszukiwać książki po tytule lub autorze.
 3 Filtrować literaturę według kategorii.

Każda karta książki zawiera: tytuł, autora, okładkę, kategorię, opis oraz przypisany typ (np. Bestseller). 

Szczegóły książki:
Kliknięcie w daną pozycję otwiera okienko ze szczegółami, które zawiera:
 Pełny opis, recenzje użytkowników oraz średnią ocenę.
 Możliwość szybkiego dodania książki do koszyka czytelnika.

Profile autorów:
Dedykowane podstrony twórców zawierają biografię, zdjęcie, lata życia, narodowość, gatunek literacki, najpopularniejsze dzieła, ciekawostki oraz cytaty. Aktualnie w bazie znajdują się:
George Orwell; J.K. Rowling; J.R.R. Tolkien

Rejestracja i Logowanie: Tworzenie konta (imię i nazwisko, email, hasło) oraz bezpieczne logowanie.

Po zalogowaniu sesja użytkownika jest zapisywana w 'Session Storage'.
Użytkownik może przeglądać książki, dodawać je do koszyka i zarządzać wypożyczonymi pozycjami.

Koszyk czytelnika (System wypożyczeń)
Użytkownik może kompletować swoją listę lektur. Sekcja ta automatycznie aktualizuje licznik i wyświetla szczegóły: okładkę, tytuł, autora oraz datę wypożyczenia. Z tego poziomu można również usuwać książki lub potwierdzić zamówienie.

System recenzji:
Możliwość wystawiania ocen (w skali 1–5 gwiazdek) oraz pisania opinii. Aplikacja na bieżąco przelicza i wyświetla średnią ocen oraz łączną liczbę recenzji dla każdej książki.

Dodatkowe smaczki i grywalizacja

Wyzwanie czytelnicze (Reading Challenge): Dołącz do wyzwania, śledź swoje postępy i licznik przeczytanych książek.

Generator Książkowego Przeznaczenia: Losuje dla Ciebie książkę z katalogu, gdy nie wiesz, po co sięgnąć.

Strefa Premium: Dostęp do ekskluzywnych rekomendacji dla wymagających czytelników.
Newsletter: Możliwość zapisania się na listę mailingową.


Architektura bazy danych (PostgreSQL)
Baza danych przechowuje informacje o trzech głównych encjach:

 1. Books (Książki)
'id' 'title' 'author' 'image' 'category' 'description' 'type'

 2. Users (Użytkownicy)
'id' 'fullName' 'email' 'password' 'role'

 3. Borrowed Books (Wypożyczone książki)
'id' 'userId' 'bookId' 'borrowDate'


REST API (Główne endpointy):

Książki ('/books')
'GET /books' – Pobranie wszystkich książek
'POST /books' – Dodanie nowej książki (Admin)
'PUT /books/{id}' – Edycja książki (Admin)
'DELETE /books/{id}' – Usunięcie książki (Admin)

Użytkownicy ('/users')
'POST /users/register' – Rejestracja nowego konta
'POST /users/login' – Logowanie do aplikacji
'GET /users' – Pobranie listy użytkowników

Wypożyczenia ('/borrow')
'POST /borrow' – Wypożyczenie książki
'GET /borrow/user/{userId}' – Pobranie wypożyczeń danego użytkownika
'DELETE /borrow/{id}' – Zwrot/usunięcie książki z listy

Autorzy:

Projekt został zrealizowany wspólnie przez zespół w składzie:
Artem Hromliuk (numer studentu: 76981)
Maksym Kaminskyi (numer studentu: 77313)
