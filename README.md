# Blogium

![Blogium](https://i.imgur.com/cZZVrpq.png)

### Opis

Blogium to wyjątkowe miejsce, gdzie użytkownicy mogą dzielić się swoimi przeżyciami i inspiracjami. Platforma dostępna jest wyłącznie dla zalogowanych użytkowników, dlatego warto jak najszybciej założyć konto. Po zalogowaniu, otwierają się przed nami pełne możliwości aplikacji. Możemy zaryzykować i odwiedzić losowy blog, odkrywając nowe historie, lub skorzystać z wyszukiwarki, aby znaleźć konkretnego autora i cieszyć się lekturą jego przygód.

Kiedy przeczytamy już wszystko, co nas interesuje, możemy stworzyć własnego bloga. Na nim to my będziemy jedynymi autorami wpisów, co daje pełną kontrolę nad treściami. Jedynie administrator ma prawo usunąć naszego bloga, co zapewnia porządek i bezpieczeństwo na platformie. Blogium to miejsce, gdzie każdy może znaleźć coś dla siebie i dzielić się swoimi opowieściami z innymi.

### Instrukcja uruchomienia

Do uruchomienia potrzebny będzie Docker Desktop wraz z klastrem Kubernetes. Aplikacja była na nim testowana i działa. Być może na innych wersjach np. Minikube też zadziała.

Aby ułatwić uruchomienie przygotowałem proste skrypty:

1.  ```run.sh``` - Służy do uruchomienia aplikacji. Gdy wszystkie komponenty będą uruchomione wyświetli się informacja. Dla bezpieczeństwa warto jednak zaczekać 1-2 minuty, ponieważ Keycloak uruchamia się dosyć długo. Pomimo tego, że status deploymentu pokazuje, że jest uruchomiony, on wciąż może być w trakcie ładowania. Aby mieć pewność najlepiej sprawdzić logi kontenera.
2.  ```port-forward.sh``` - Po odczekaniu chwili należy uruchomić skrypt, aby przekierować porty z klastra na te lokalne.
3. Aplikacja powinna być dostępna w przeglądarce pod adresem http://localhost:3000
4. ```rm.sh``` - Służy do usunięcia wszyskiego związanego z aplikacją w klastrze.

### Istniejące konta w aplikacji do zalogowania
|   | login | hasło  |
|---|-------|--------|
| 1 | admin | 121212 |
| 2 | john  | 121212 |
|   |       |        |