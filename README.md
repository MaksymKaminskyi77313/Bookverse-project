# Dokumentacja Projektu 

## Nazwa zespołu
BookVerse Team

## Skład zespołu
* Artem Hromliuk (numer studenta: 76981)
* Maksym Kaminskyi (numer studentu: 77313)

## Krótki opis aplikacji
BookVerse to aplikacja webowa typu full-stack inspirowana popularnymi serwisami do katalogowania książek (takimi jak Lubimyczytać). Platforma umożliwia rejestrację i logowanie użytkowników, przeglądanie responsywnego katalogu książek, sprawdzanie szczegółowych informacji w oknach modalnych oraz zarządzanie własną 'półką' (koszykiem czytelnika). Dodatkowo zaimplementowano panel administracyjny do zarządzania bazą danych (dodawanie, edycja, usuwanie książek) oraz elementy grywalizacji, takie jak wyzwania czytelnicze i generatory misji.

Aplikacja działa w architekturze klient-serwer: frontend stworzono w czystym HTML, CSS i JavaScript, backend oparto na frameworku Spring Boot (Java), a dane przechowywane są w relacyjnej bazie PostgreSQL.

## Wykorzystane technologie

Frontend:
* HTML 
* CSS
* JavaScript 

Backend:
* Java 21
* Spring Boot
* Maven

Baza danych:
* PostgreSQL (Neon)

Hosting:
* Vercel
* Render

## Endpointy do sprawdzenia
Aplikacja komunikuje się poprzez REST API. Główne endpointy to:

Książki ('/books')
* 'GET /books' – pobranie pełnej listy książek
* 'POST /books' – dodanie nowej książki (wymaga roli Admin)
* 'PUT /books/{id}' – edycja istniejącej książki (Admin)
* 'DELETE /books/{id}' – usunięcie książki z bazy (Admin)

Użytkownicy i Autentykacja ('/users')
* 'POST /users/register' – rejestracja nowego konta użytkownika
* 'POST /users/login' – autentykacja i logowanie (zapis sesji w Session Storage)
* 'GET /users' – pobranie listy zarejestrowanych użytkowników

Koszyk ('/borrow')
* 'POST /borrow' – dodanie książki do koszyka 
* 'GET /borrow/user/{userId}' – pobranie listy książek przypisanych do konkretnego użytkownika
* 'DELETE /borrow/{id}' – zwrot książki lub usunięcie jej z listy

## Instrukcja uruchomienia lokalnego

### Backend (Spring Boot)
1. Sklonować repozytorium projektu.
2. Przejść do katalogu 'backend'.
3. Skonfigurować połączenie z bazą danych w pliku 'application.properties' (lub ustawić odpowiednie zmienne środowiskowe dla bazy PostgreSQL).
4. Uruchomić aplikację za pomocą Maven Wrapper:
   ./mvnw spring-boot:run
5. Backend uruchomi się domyślnie na porcie 8080.

### Frontend (Vite / Vanilla JS)
1. Przejść do katalogu 'frontend'.
2. Zainstalować wymagane zależności:
   npm install
3. Uruchomić serwer deweloperski:
   npm run dev
4. Frontend uruchomi się lokalnie na porcie 5173.

## Publiczne wdrożenia
Aplikacja została w pełni wdrożona w chmurze i jest dostępna pod poniższymi adresami:
* **Frontend:** [https://bookverseproject-alpha.vercel.app/](https://bookverseproject-alpha.vercel.app/)
* **Backend:** [https://twoj-backend.onrender.com ](https://bookverse-project.onrender.com)

## Lista sprawdzonych platform
* **Vercel** – hosting frontendu i automatyczny deployment z GitHuba.
* **Render** – hosting aplikacji backendowej w Spring Boot.
* **Neon Database** – chmurowa, bezserwerowa baza danych PostgreSQL.

## Co udało się zrealizować
* Pełny system rejestracji i bezpiecznego logowania użytkowników z obsługą ról (User / Admin).
* Zarządzanie sesją użytkownika po stronie frontendu przy użyciu 'Session Storage'.
* Integracja backendu z chmurową relacyjną bazą danych PostgreSQL (Neon) za pomocą Spring Data JPA i Hibernate.
* Kompletny moduł CRUD dla książek zarządzany z poziomu dynamicznego Panelu Administratora.
* Dynamiczny koszyk czytelnika obsługujący system wypożyczeń i automatyczne aktualizowanie liczników.
* Interaktywny interfejs użytkownika z obsługą trybów Dark Mode / Light Mode, systemem recenzji oraz dodatkami (Reading Challenge, Generator Przeznaczenia).
* Stabilne publiczne wdrożenie obu warstw aplikacji oraz zapewnienie poprawnej komunikacji CORS między frontendem na Vercel a backendem na Render.

## Co nie udało się zrealizować / Plany na przyszłość
* Trwałe zapisywanie recenzji i ocen użytkowników bezpośrednio w bazie danych (obecnie działają w obrębie stanu aplikacji).
* Możliwość dodawania komentarzy pod recenzjami innych czytelników.
* Zaawansowany system wyszukiwania pełnotekstowego (full-text search) oraz paginacja wyników przy dużych zbiorach danych.
* System rekomendacji książek oparty na zaawansowanych algorytmach preferencji użytkownika.

## Problemy napotkane podczas wdrożenia i konfiguracji

* **Wersja Javy:** Backend produkcyjny został napisany i wymaga do działania środowiska Java 21. Konieczne było jawne wskazanie wersji środowiska uruchomieniowego w konfiguracji usług platformy Render, aby uniknąć błędów kompilacji (wybór odpowiedniego Dockerfile lub natywnego środowiska Render).
* **Sposób budowania projektu:** Projekt jest budowany i zarządzany za pomocą narzędzia Maven. W środowisku produkcyjnym aplikacja budowana jest automatycznie ze źródeł z wykorzystaniem polecenia:
  ./mvnw clean package
* **Port aplikacji:** Lokalnie backend działa na porcie 8080. Przy wdrożeniu na Renderze aplikacja musiała zostać zmodyfikowana tak, aby dynamicznie bindować port przekazywany przez zmienną środowiskową 'PORT' ustawianą przez platformę hostingową.
* **Zmienne środowiskowe:** Bezpieczeństwo danych wymagało ukrycia wrażliwych danych dostępowych do bazy Neon PostgreSQL. Wszystkie dane uwierzytelniające (URL bazy, login, hasło) zostały skonfigurowane jako zmienne środowiskowe bezpośrednio w panelu administracyjnym Render, dzięki czemu nie są hardkodowane w kodzie źródłowym.
* **Logi:** Podczas pierwszych prób wdrożenia napotkano błędy połączenia z bazą oraz błędy CORS. Do ich zdiagnozowania i wyeliminowania kluczowe okazało się bieżące analizowanie logów konsoli (Live Logs) udostępnianych przez platformę Render.
* **Usypianie aplikacji w darmowej wersji:** Z racji korzystania z darmowego planu (Free Tier) na platformie Render, aplikacja przechodzi w stan uśpienia (spin down) po 15 minutach braku aktywności. Skutkuje to tym, że pierwsze zapytanie wysłane do API po dłuższej przerwie wymaga odczekania około 50 sekund na ponowne wybudzenie kontenera.


## Wnioski
* **Najłatwiejsza platforma:** **Vercel**. Proces wdrożenia frontendu napisanego w JavaScripcie był niezwykle prosty, w pełni zautomatyzowany i sprowadzał się do podpięcia repozytorium GitHub. Platforma sama rozpoznaje strukturę i błyskawicznie serwuje pliki statyczne z darmowym certyfikatem SSL.
* **Najtrudniejsza platforma:** **Render**. Wdrożenie aplikacji Spring Boot wymagało znacznie większego nakładu pracy: konfiguracji odpowiedniego środowiska uruchomieniowego, zarządzania zmiennymi środowiskowymi dla bazy danych, rozwiązania problemów z mapowaniem portów oraz radzenia sobie z ograniczeniami darmowego planu (usypianie aplikacji).
* **Baza danych:** Wybór platformy **Neon Database** do obsługi bazy PostgreSQL okazał się strzałem w dziesiątkę. Bezserwerowa architektura idealnie współgra z darmowymi narzędziami, a intuicyjny panel pozwolił na błyskawiczne wygenerowanie potrzebnych tabel i integrację ze Spring Data JPA.
