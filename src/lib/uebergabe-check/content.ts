// src/lib/uebergabe-check/content.ts
//
// Textbausteine für den Ergebnisbericht.
//
// ═══════════════════════════════════════════════════════════════════════════
//  TONALITÄT
//  Die Einordnungen ziehen bewusst plausible Schlüsse aus den Antworten und
//  benennen, was das für eine Übergabe bedeutet. Sie sind keine auf die
//  mathematisch strengste Minimalbehauptung reduzierten Sätze mehr.
//
//  Kenntlich gemacht wird der Interpretationscharakter über die Sprache
//  („spricht dafür“, „dürfte“, „deutet darauf hin“, „kann“) und einmalig über
//  METHOD_NOTE ganz am Ende. Deshalb muss nicht jeder einzelne Satz mit
//  „möglicherweise“ und „gegebenenfalls“ überladen werden.
//
//  Konkrete Aussagen zu einzelnen Antworten entstehen weiterhin ausschließlich
//  über die Item-Hinweise in scoring.ts.
//
//  ACHTUNG beim Ergänzen: Der methodische Vorbehalt steht GENAU EINMAL im
//  Dokument, am Schluss. Mehrfach wiederholt unterbricht er die Bewegung
//  Profil → verstehen → Prüffelder → diskutieren → handeln und schwächt jede
//  Aussage, die der Bericht trifft.
// ═══════════════════════════════════════════════════════════════════════════

import type { DimensionId } from "./items";
import type { MaturityLevel } from "./scoring";

/**
 * Kurze Lesehilfe unter den sechs Dimensionskarten. Ersetzt die frühere
 * dreiteilige Erklärbox aus Diagrammlogik, Gesamtwert-Hinweis und
 * Kontextualisierung.
 */
export const PROFILE_READING_TITLE = "So lesen Sie Ihr Profil";

export const PROFILE_READING_TEXT =
  "Je weiter außen eine Dimension liegt, desto stärker sind die im Schnellcheck betrachteten Voraussetzungen für eine organisationale Übergabe ausgeprägt. Entscheidend ist dabei weniger ein einzelner Wert als das Zusammenspiel der sechs Bereiche.";

/**
 * Der einzige methodische Vorbehalt im ganzen Bericht. Steht klein am Ende,
 * nicht oben und nicht mehrfach.
 */
export const METHOD_NOTE =
  "Der Schnellcheck ist eine strukturierte Erstindikation auf Basis Ihrer Antworten. Die Ergebnisse sind keine abschließende Organisationsdiagnose und sollten im Kontext Ihrer konkreten Übergabesituation eingeordnet werden.";

export const FLAGS_SECTION_TITLE = "Auffällig in Ihren Antworten";

export const FLAGS_SECTION_HINT =
  "Einzelne Antworten, die unabhängig vom Punktwert dieser Dimension eine nähere Betrachtung verdienen. Sie verändern den Punktwert nicht und bedeuten keine Rangfolge: welche Punkte zuerst Aufmerksamkeit brauchen, hängt von Ihrem Übergabezeitpunkt, der Art der Nachfolge und Ihrer künftigen Rolle ab.";

export type LevelMeta = {
  label: string;
  meaning: string;
  color: string;
  range: string;
};

export const LEVEL_META: Record<MaturityLevel, LevelMeta> = {
  stable: {
    label: "Gut ausgeprägt",
    range: "75–100",
    color: "rgb(0,168,165)",
    meaning:
      "Die im Schnellcheck betrachteten Voraussetzungen in dieser Dimension sind insgesamt gut ausgeprägt.",
  },
  observe: {
    label: "Überwiegend ausgeprägt",
    range: "50–74",
    color: "rgb(0,112,125)",
    meaning:
      "Die Voraussetzungen sind überwiegend vorhanden. Einzelne Teilaspekte können unterschiedlich ausgeprägt sein und sollten im Hinblick auf die Übergabe geprüft werden.",
  },
  develop: {
    label: "Entwicklungsbedarf",
    range: "25–49",
    color: "rgb(202,138,4)",
    meaning:
      "Die Voraussetzungen sind nur teilweise ausgeprägt. Eine gezielte Betrachtung der einzelnen Teilaspekte ist ratsam.",
  },
  elevated: {
    label: "Deutlicher Entwicklungsbedarf",
    range: "0–24",
    color: "rgb(185,28,28)",
    meaning:
      "Die im Schnellcheck betrachteten Voraussetzungen in dieser Dimension sind insgesamt gering ausgeprägt. Eine vertiefte Betrachtung der einzelnen Teilaspekte ist im Hinblick auf die konkrete Übergabesituation sinnvoll.",
  },
};

export type LevelText = {
  /** Einordnung */
  interpretation: string;
  /** Handlungs- und Prüfimpuls */
  impulse: string;
};

export type DimensionContent = {
  id: DimensionId;
  title: string;
  shortTitle: string;
  axisLabel: readonly [string, string];
  /** Leitfrage während der Befragung. */
  focus: string;
  /** Score-unabhängige Kurzerklärung im Bericht. */
  explanation: string;
  levels: Record<MaturityLevel, LevelText>;
};

export const DIMENSIONS: readonly DimensionContent[] = [
  {
    id: 1,
    title: "Inhaberunabhängigkeit",
    shortTitle: "Inhaberunabhängigkeit",
    axisLabel: ["Inhaber-", "unabhängigkeit"],
    focus:
      "Wie weit funktioniert das operative Tagesgeschäft unabhängig von der unmittelbaren Einbindung des Inhabers?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die im Schnellcheck erfassten Bereiche des operativen Tagesgeschäfts unabhängig von der unmittelbaren Einbindung des Inhabers funktionieren. Betrachtet werden operative Entscheidungen, wesentliche Kundenverhandlungen, die Fortführung bei längerer Abwesenheit sowie dezentrale Freigabegrenzen.",
    levels: {
      stable: {
        interpretation:
          "Ihr Unternehmen kann wesentliche Teile des Tagesgeschäfts offenbar bereits ohne Ihre unmittelbare Beteiligung bewältigen. Das ist für eine Übergabe eine starke Ausgangslage: Ein Nachfolger übernimmt eher eine handlungsfähige Organisation als eine Vielzahl persönlicher Abhängigkeiten vom bisherigen Inhaber. Entscheidend ist nun weniger die grundsätzliche Entflechtung als die Frage, welche wenigen Verbindungen weiterhin bewusst an Ihre Person gekoppelt sind.",
        impulse:
          "Betrachten Sie gezielt die Situationen, in denen Sie heute noch persönlich eingreifen oder eingebunden werden. Prüfen Sie, welche davon tatsächlich Inhaberaufgabe bleiben müssen und welche vor einer Übergabe noch auf Rollen, Regeln oder andere Personen übertragen werden sollten.",
      },
      observe: {
        interpretation:
          "Ihr Unternehmen verfügt bereits über eine erkennbare operative Eigenständigkeit, ist aber noch nicht durchgängig vom Inhaber gelöst. Für eine Übergabe ist das grundsätzlich eine gute Basis. Einzelne verbliebene Abhängigkeiten können jedoch gerade dann sichtbar werden, wenn Entscheidungen schneller getroffen werden müssen oder gewohnte persönliche Beziehungen und Freigabewege nicht mehr zur Verfügung stehen.",
        impulse:
          "Machen Sie Ihre persönliche Beteiligung für einige Wochen bewusst sichtbar: Wo werden Sie tatsächlich gebraucht, wo lediglich aus Gewohnheit eingebunden? Gerade wiederkehrende Rückfragen, Freigaben und persönliche Außenkontakte zeigen, welche Abhängigkeiten vor einer Übergabe noch gezielt reduziert werden können.",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis spricht dafür, dass der Inhaber für die operative Handlungsfähigkeit des Unternehmens noch eine deutlich tragende Rolle spielt. Das muss im inhabergeführten Mittelstand kein Problem sein. Bei einer Übergabe wird daraus jedoch eine Aufgabe: Ein Nachfolger kann persönliche Entscheidungswege, Beziehungen und Routinen nicht automatisch übernehmen.",
        impulse:
          "Identifizieren Sie zunächst die Situationen, in denen ohne Ihre Beteiligung Entscheidungen verzögert würden oder Geschäftsvorgänge ins Stocken geraten könnten. Priorisieren Sie anschließend diejenigen Abhängigkeiten, die für Kunden, Liquidität oder den laufenden Betrieb besonders relevant sind, und beginnen Sie dort mit der Übertragung.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen für eine starke operative Kopplung des Unternehmens an die Person des Inhabers. Ein Wechsel an der Spitze würde deshalb voraussichtlich nicht nur die Führung verändern, sondern unmittelbar in bestehende Entscheidungs- und Arbeitsabläufe eingreifen. Für eine geplante Übergabe ist diese Abhängigkeit ein zentraler Vorbereitungsbereich.",
        impulse:
          "Versuchen Sie nicht, sämtliche Abhängigkeiten gleichzeitig zu beseitigen. Beginnen Sie mit den geschäftskritischen Entscheidungen und Vorgängen, die heute ohne Sie nicht oder nur verzögert funktionieren würden. Für jeden dieser Punkte sollte geklärt werden: Wer könnte übernehmen, welche Befugnis fehlt und was muss dafür vorher übertragen werden?",
      },
    },
  },
  {
    id: 2,
    title: "Schlüsselpersonen & Wissen",
    shortTitle: "Schlüsselpersonen",
    axisLabel: ["Schlüsselpersonen", "& Wissen"],
    focus:
      "Wie geht die Organisation mit personengebundenem Fach- und Erfahrungswissen um?",
    explanation:
      "Diese Dimension betrachtet, wie die Organisation in den abgefragten Bereichen mit personengebundenem Fach- und Erfahrungswissen umgeht. Betrachtet werden Stellvertretung, Verteilung von Erfahrungswissen, Auswirkungen des Ausfalls einzelner Fachkräfte und Wissenstransfer bei personellen Wechseln.",
    levels: {
      stable: {
        interpretation:
          "Geschäftskritisches Wissen und wichtige Fachaufgaben scheinen in Ihrem Unternehmen bereits vergleichsweise robust verteilt zu sein. Damit sinkt das Risiko, dass eine Übergabe zusätzlich durch den Ausfall einzelner Wissensträger belastet wird. Für einen Nachfolger ist das wertvoll: Er übernimmt Wissen eher als organisationale Ressource und weniger als Sammlung persönlicher Wissensmonopole.",
        impulse:
          "Konzentrieren Sie sich jetzt auf die Ausnahmen. Fragen Sie bei besonders komplexen, seltenen oder geschäftskritischen Aufgaben: Wer außer der zuständigen Person könnte morgen übernehmen? Gerade dort, wo die Antwort schwerfällt, können trotz eines insgesamt guten Niveaus relevante Einzelabhängigkeiten liegen.",
      },
      observe: {
        interpretation:
          "Wissen und Schlüsselaufgaben sind in Ihrem Unternehmen offenbar bereits teilweise gegen personelle Ausfälle abgesichert. Gleichzeitig dürfte die Robustheit nicht in allen Bereichen gleich sein. Im normalen Betrieb fällt das häufig kaum auf; während einer Übergabe können einzelne Wissensmonopole jedoch zusätzliche Abhängigkeiten erzeugen.",
        impulse:
          "Erstellen Sie für Ihre wichtigsten Funktionen eine einfache Vertretungsmatrix: Wer trägt kritisches Wissen, wer kann tatsächlich vertreten und wie lange wäre ein Ausfall verkraftbar? Damit werden die Stellen sichtbar, an denen Wissen noch stärker geteilt oder übertragen werden sollte.",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis deutet darauf hin, dass geschäftskritisches Wissen und Handlungsfähigkeit noch spürbar an einzelne Personen gebunden sein können. Damit besteht neben der Abhängigkeit vom Inhaber möglicherweise eine zweite Ebene personeller Abhängigkeit. Bei einer Übergabe kann das relevant werden, weil Schlüsselpersonen dann erheblichen Einfluss auf Stabilität und Kontinuität haben.",
        impulse:
          "Identifizieren Sie die Personen, deren unerwarteter Ausfall den Betrieb besonders treffen würde. Erfassen Sie anschließend nicht nur deren Aufgaben, sondern vor allem das schwer ersetzbare Erfahrungswissen, die Kontakte und Problemlösungsroutinen, die bislang überwiegend bei ihnen liegen.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen dafür, dass zentrale Aufgaben und Wissen stark auf einzelne Personen konzentriert sind. Eine Übergabe wäre damit nicht nur vom Wechsel des Inhabers betroffen, sondern zusätzlich von der Verfügbarkeit einzelner Schlüsselkräfte abhängig. Das erhöht die Verletzlichkeit der Organisation in einer ohnehin sensiblen Phase.",
        impulse:
          "Beginnen Sie mit einer einfachen Schlüsselfrage: Welche drei Personen dürften morgen keinesfalls für längere Zeit ausfallen? Prüfen Sie für deren wichtigste Aufgaben, welches Wissen übertragen, welche Vertretung aufgebaut und welche Abhängigkeit zumindest transparent gemacht werden muss.",
      },
    },
  },
  {
    id: 3,
    title: "Führung & Verantwortung",
    shortTitle: "Führung & Verantwortung",
    axisLabel: ["Führung &", "Verantwortung"],
    focus:
      "Wie weit kann die Führungsebene eigenständig handeln und Verantwortung übernehmen?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die Führungsebene in den abgefragten Bereichen eigenständig handeln und Verantwortung übernehmen kann. Betrachtet werden Entscheidungs- und Budgetbefugnisse, eigenständige Problembearbeitung, Rückversicherung beim Inhaber und die selbstständige Abstimmung im Führungsteam.",
    levels: {
      stable: {
        interpretation:
          "Führung und Verantwortung sind in Ihrem Unternehmen offenbar bereits so verteilt, dass die nachgelagerte Führungsebene eigenständig handeln kann. Das erleichtert eine Übergabe erheblich: Ein Nachfolger übernimmt nicht nur Mitarbeiter und Strukturen, sondern ein Führungssystem, das Verantwortung bereits trägt. Zu prüfen bleibt, wie stark diese Eigenständigkeit an etablierte Rollen gebunden ist und wie stark sie noch von der eingespielten Zusammenarbeit mit dem heutigen Inhaber lebt.",
        impulse:
          "Machen Sie einen Praxistest: Welche wesentlichen Entscheidungen könnte Ihre Führungsebene auch dann treffen, wenn Sie mehrere Wochen nicht erreichbar wären? Wo dennoch Rückfragen entstehen, lohnt sich die Klärung von Entscheidungsräumen, Befugnissen und Verantwortungsgrenzen.",
      },
      observe: {
        interpretation:
          "Ihre Führungsebene übernimmt bereits erkennbar Verantwortung, scheint aber noch nicht in allen Situationen vollständig unabhängig vom Inhaber zu handeln. Für eine Übergabe ist das eine brauchbare Ausgangslage. Entscheidend wird sein, ob Führungskräfte nach dem Wechsel tatsächlich Entscheidungen tragen oder bei Unsicherheit weiterhin eine Instanz suchen, die die bisherige Inhaberrolle ersetzt.",
        impulse:
          "Beobachten Sie, bei welchen Themen Entscheidungen noch nach oben zurückgegeben oder vorsorglich abgesichert werden. Klären Sie dort nicht nur Zuständigkeiten, sondern auch, welche Entscheidungen Führungskräfte ausdrücklich selbst treffen dürfen, einschließlich des Rechts, innerhalb ihres Rahmens auch einmal anders zu entscheiden als Sie.",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis spricht dafür, dass Führungsverantwortung noch deutlich mit der Person des Inhabers verbunden ist. Führungskräfte können zwar formale Verantwortung besitzen, in entscheidenden Situationen aber dennoch Orientierung oder Absicherung beim Inhaber suchen. Ein Nachfolger würde dann möglicherweise nicht nur die Unternehmensführung übernehmen, sondern zugleich zahlreiche operative Führungsentscheidungen erben.",
        impulse:
          "Identifizieren Sie typische Entscheidungen, die heute regelmäßig bei Ihnen landen. Legen Sie für ausgewählte Bereiche verbindlich fest, wer künftig entscheidet, innerhalb welcher Grenzen und wann tatsächlich eskaliert werden soll. Entscheidend ist anschließend, diese Verantwortung im Alltag auch dort stehen zu lassen.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen für eine Führungskonstellation, in der wesentliche Verantwortung noch stark beim Inhaber zusammenläuft. Damit wäre ein Nachfolger zunächst selbst ein zentraler Bestandteil des operativen Führungssystems. Das kann die Übergabe erschweren und zugleich den Handlungsspielraum der vorhandenen Führungskräfte begrenzen.",
        impulse:
          "Beginnen Sie nicht mit Organigrammen, sondern mit tatsächlichen Entscheidungen. Sammeln Sie über einige Wochen die Themen, die bei Ihnen zur Entscheidung landen, und ordnen Sie diese konsequent neu zu: Was gehört wirklich zum Inhaber, was zur Führungsebene und welche Befugnisse braucht diese, um Verantwortung tatsächlich übernehmen zu können?",
      },
    },
  },
  {
    id: 4,
    title: "Strukturen & Prozesse",
    shortTitle: "Strukturen & Prozesse",
    axisLabel: ["Strukturen", "& Prozesse"],
    focus:
      "Wie nachvollziehbar und organisatorisch abgesichert sind Arbeitsabläufe und Schnittstellen?",
    explanation:
      "Diese Dimension betrachtet die Nachvollziehbarkeit und organisatorische Absicherung der abgefragten Arbeitsabläufe und Schnittstellen. Betrachtet werden Dokumentation und Einarbeitbarkeit, Zuständigkeiten zwischen Abteilungen, das Verhältnis zwischen offiziellen Vorgaben und gelebter Praxis sowie festgelegte Abstimmungswege bei Konflikten.",
    levels: {
      stable: {
        interpretation:
          "Die betrachteten Abläufe, Verantwortlichkeiten und Schnittstellen erscheinen bereits vergleichsweise transparent und übertragbar. Das erleichtert einem Nachfolger, das Unternehmen zu verstehen und zu führen, ohne sämtliche informellen Regeln erst selbst entschlüsseln zu müssen. Gewachsene persönliche Abstimmungen können dennoch auch in gut strukturierten Organisationen bestehen.",
        impulse:
          "Testen Sie Ihre Strukturen aus Sicht eines Außenstehenden: Wo müsste ein neuer Geschäftsführer oder eine neue Führungskraft trotzdem jemanden fragen, „wie es hier wirklich läuft“? Diese Stellen sind gute Kandidaten für die letzte Meile der Übergabevorbereitung.",
      },
      observe: {
        interpretation:
          "Ihr Unternehmen verfügt bereits über erkennbare Strukturen und geregelte Abläufe, gleichzeitig dürfte ein Teil des tatsächlichen Funktionierens noch auf Erfahrung und informeller Abstimmung beruhen. Solange die beteiligten Personen bleiben, funktioniert das häufig gut. Bei einer Übergabe muss ein Nachfolger diese unsichtbaren Spielregeln jedoch erst erkennen.",
        impulse:
          "Suchen Sie nicht nach vollständiger Dokumentation. Konzentrieren Sie sich auf geschäftskritische Schnittstellen und wiederkehrende Konfliktpunkte. Fragen Sie dort: Ist für einen neuen Verantwortlichen nachvollziehbar, wer entscheidet, wer beteiligt wird und wie mit Abweichungen umgegangen wird?",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis deutet darauf hin, dass ein relevanter Teil der Organisation über gewachsene Praxis und informelle Abstimmung funktioniert. Das kann im eingespielten Alltag effizient sein, erschwert jedoch die Übertragbarkeit: Ein Nachfolger kennt die unausgesprochenen Regeln, Zuständigkeiten und Eskalationswege zunächst nicht.",
        impulse:
          "Beginnen Sie mit wenigen geschäftskritischen Kernabläufen. Dokumentieren Sie nicht jedes Detail, sondern Verantwortlichkeiten, Schnittstellen, Entscheidungsrechte und Eskalationswege. Ziel ist nicht mehr Bürokratie, sondern dass ein Dritter verstehen kann, wie das Unternehmen tatsächlich funktioniert.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen für eine Organisation, deren Funktionieren stark von informellem Wissen, persönlichen Abstimmungen und gewachsenen Abläufen getragen wird. Bei einer Übergabe kann dadurch ein erheblicher Teil der tatsächlichen Organisationslogik unsichtbar bleiben. Ein Nachfolger müsste sie erst im laufenden Betrieb entschlüsseln.",
        impulse:
          "Machen Sie zunächst die wichtigsten unsichtbaren Regeln sichtbar. Wählen Sie drei bis fünf Abläufe, deren Störung unmittelbar Kunden, Leistung oder Liquidität treffen würde, und halten Sie fest: Wer entscheidet, wer muss beteiligt werden, welche Übergaben sind kritisch und was passiert bei Abweichungen?",
      },
    },
  },
  {
    id: 5,
    title: "Kultur & Identität",
    shortTitle: "Kultur & Identität",
    axisLabel: ["Kultur &", "Identität"],
    focus:
      "Wie unabhängig von der Person des Inhabers sind Orientierung und Zusammenarbeit im Alltag?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die in den vier Items erfassten Orientierungsmuster und Formen der Zusammenarbeit von der Person des Inhabers unabhängig sind. Betrachtet werden inhaberbezogene Entscheidungsorientierung, Identifikation mit dem Unternehmen, Zusammenarbeit bei Inhaberabwesenheit und Offenheit gegenüber externen Führungskräften.",
    levels: {
      stable: {
        interpretation:
          "Das Selbstverständnis des Unternehmens scheint bereits deutlich über die Person des Inhabers hinauszureichen. Das ist für eine Nachfolge besonders wertvoll: Ein Führungswechsel muss dann nicht automatisch zu einem Identitätswechsel des gesamten Unternehmens werden. Mitarbeiter können sich weiterhin an dem orientieren, wofür das Unternehmen steht, auch wenn sich die Person an der Spitze verändert.",
        impulse:
          "Machen Sie greifbar, was unabhängig von Ihnen erhalten bleiben soll. Fragen Sie Führungskräfte und Mitarbeiter, wofür das Unternehmen steht, was es auszeichnet und was auch unter einem neuen Inhaber nicht verloren gehen sollte. Je ähnlicher die Antworten ohne Ihre Vorgabe ausfallen, desto belastbarer ist dieses gemeinsame Selbstverständnis.",
      },
      observe: {
        interpretation:
          "Ihr Unternehmen besitzt offenbar bereits ein eigenes Selbstverständnis, gleichzeitig spielt die Person des Inhabers weiterhin eine erkennbare Rolle für Orientierung und Kultur. Das ist in inhabergeführten Unternehmen normal. Für eine Übergabe wird entscheidend, welche Teile dieser Prägung zum Unternehmen selbst geworden sind und welche tatsächlich mit dem bisherigen Inhaber gehen.",
        impulse:
          "Fragen Sie unabhängig voneinander einige Mitarbeiter und Führungskräfte: „Was macht dieses Unternehmen aus?“ und „Was müsste ein Nachfolger unbedingt verstehen?“ Die Antworten zeigen, welche Identitätsmerkmale bereits gemeinsam getragen werden und wo das Unternehmen noch stark über Ihre Person erklärt wird.",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis spricht dafür, dass Orientierung und Selbstverständnis des Unternehmens noch spürbar mit der Person des Inhabers verbunden sind. Bei einer Übergabe geht damit mehr über als eine Führungsfunktion: Mitarbeiter müssen teilweise neu beantworten, woran sie Entscheidungen, Erwartungen und Zugehörigkeit künftig ausrichten.",
        impulse:
          "Beobachten Sie Situationen, in denen Ihre persönliche Vorgabe fehlt. Orientieren sich Mitarbeiter dann an gemeinsamen Prinzipien, etablierten Rollen und dem Unternehmen selbst, oder wird nach dem vermuteten Willen des Inhabers gesucht? Diese Situationen zeigen, wo organisationale Orientierung noch stärker vom Inhaber gelöst werden kann.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen für eine starke Verbindung zwischen der Person des Inhabers und der Identität bzw. Orientierung des Unternehmens. Ein Nachfolger übernimmt damit nicht einfach eine bestehende Rolle. Sein Eintritt kann von Mitarbeitern als Veränderung dessen erlebt werden, wofür das Unternehmen steht und wie es funktioniert.",
        impulse:
          "Versuchen Sie zunächst zu trennen, was tatsächlich „Sie“ ist und was dauerhaft „das Unternehmen“ sein soll. Werte, Entscheidungsprinzipien, Umgang mit Kunden und Mitarbeitern oder besondere Arbeitsweisen sollten dort, wo sie erhalten bleiben sollen, zunehmend durch Führung und Organisation getragen werden, nicht nur durch Ihr persönliches Vorbild.",
      },
    },
  },
  {
    id: 6,
    title: "Veränderungsfähigkeit & Anpassungsbereitschaft",
    shortTitle: "Veränderungsfähigkeit",
    axisLabel: ["Veränderungs-", "fähigkeit"],
    focus:
      "Wie geht die Organisation mit personellen und strukturellen Veränderungen um?",
    explanation:
      "Diese Dimension betrachtet, wie die Organisation in den abgefragten Bereichen mit personellen und strukturellen Veränderungen umgeht. Betrachtet werden Führungswechsel, veränderte Zuständigkeiten und Führungsstrukturen, Erfahrungen mit früheren organisatorischen Veränderungen sowie der Umgang mit der Anpassung bestehender Sonderregelungen.",
    levels: {
      stable: {
        interpretation:
          "Ihre Organisation scheint Veränderungen in Führung, Zuständigkeiten und gewachsenen Arbeitsweisen vergleichsweise gut aufnehmen zu können. Das ist für eine Nachfolge eine wichtige Ressource: Nicht jede Veränderung muss erst gegen bestehende Routinen durchgesetzt werden. Trotzdem bleibt eine Unternehmensübergabe eine besondere Veränderung, weil sie häufig mehrere vertraute Orientierungspunkte gleichzeitig berührt.",
        impulse:
          "Nutzen Sie diese Veränderungsfähigkeit bewusst. Klären Sie früh, was sich durch die Nachfolge ändern darf, was zunächst stabil bleiben soll und welche Entscheidungen der Nachfolger selbst treffen muss. Eine anpassungsfähige Organisation braucht nicht weniger Orientierung, sie kann mit klarer Orientierung nur schneller handeln.",
      },
      observe: {
        interpretation:
          "Ihr Unternehmen hat offenbar grundsätzlich die Fähigkeit, Veränderungen aufzunehmen, gleichzeitig dürften nicht alle Eingriffe gleich leicht akzeptiert werden. Für eine Nachfolge ist deshalb weniger die allgemeine Veränderungsbereitschaft entscheidend als die Frage, wo neue Führung, veränderte Zuständigkeiten oder der Verlust gewohnter Regelungen auf Widerstand treffen könnten.",
        impulse:
          "Schauen Sie auf frühere Veränderungen: Welche wurden schnell angenommen und bei welchen entstanden Verzögerungen oder informelle Gegenbewegungen? Die Muster dahinter können Hinweise darauf geben, welche Themen bei einer Nachfolge früh erklärt, beteiligt oder besonders aufmerksam begleitet werden sollten.",
      },
      develop: {
        interpretation:
          "Ihr Ergebnis deutet darauf hin, dass Veränderungen in Führung, Zuständigkeiten oder gewachsenen Arbeitsweisen in Ihrer Organisation nicht selbstverständlich aufgenommen werden. Eine Nachfolge kann dadurch langsamer und aufwendiger werden: Formale Entscheidungen sind möglicherweise schnell getroffen, ihre tatsächliche Umsetzung im Alltag braucht jedoch mehr Zeit und Aufmerksamkeit.",
        impulse:
          "Identifizieren Sie früh die Veränderungen, die eine Nachfolge voraussichtlich auslösen wird. Fragen Sie nicht nur, wer davon sachlich betroffen ist, sondern auch, wer Verantwortung, Einfluss, Gewohnheiten oder Sonderstellungen gewinnen oder verlieren könnte. Genau dort entstehen häufig Treiber und Bremser einer Veränderung.",
      },
      elevated: {
        interpretation:
          "Die Antworten sprechen dafür, dass substanzielle Veränderungen in Ihrer Organisation auf erhebliche Beharrungskräfte treffen können. Bei einer Nachfolge kann dies dazu führen, dass neue Zuständigkeiten oder Führungsimpulse formal eingeführt werden, im Arbeitsalltag aber nur langsam wirksam werden. Der eigentliche Übergang kann dadurch deutlich länger dauern als der rechtliche Eigentümerwechsel.",
        impulse:
          "Behandeln Sie die Nachfolge nicht nur als Wechsel an der Spitze. Erfassen Sie, welche Veränderungen sie für einzelne Gruppen und Schlüsselpersonen bedeutet: Wer gewinnt oder verliert Verantwortung, Einfluss, Nähe zur Führung oder gewohnte Sonderstellungen? Daraus lässt sich früh erkennen, wo Kommunikation, Beteiligung und klare Entscheidungen besonders wichtig werden.",
      },
    },
  },
];

export function dimensionContent(id: DimensionId): DimensionContent {
  const content = DIMENSIONS.find((dimension) => dimension.id === id);
  if (!content) throw new Error(`Unbekannte Dimension: ${id}`);
  return content;
}

// ── Beta-Feedback ────────────────────────────────────────────────────────────
// Freiwillige Beantwortung, keine Pflichtfragen. Anzeige über BETA_MODE.

export type FeedbackQuestion = {
  key:
    | "q1_verstaendlichkeit"
    | "q2_vollstaendigkeit"
    | "q3_praxisabgleich"
    | "q4_anwendbarkeit"
    | "q5_verbesserung";
  label: string;
  question: string;
  placeholder: string;
};

export const FEEDBACK_QUESTIONS: readonly FeedbackQuestion[] = [
  {
    key: "q1_verstaendlichkeit",
    label: "Verständlichkeit",
    question:
      "Gab es Fragen, die Sie im ersten Moment nicht eindeutig beantworten konnten oder bei denen Sie dachten: „Das kommt ganz darauf an“? Wenn ja, welche?",
    placeholder: "z. B. Frage 3 in Dimension 4 …",
  },
  {
    key: "q2_vollstaendigkeit",
    label: "Vollständigkeit",
    question:
      "Fehlt aus Ihrer Sicht ein wesentlicher Aspekt, um die Unabhängigkeit eines Unternehmens vom Inhaber valide zu bewerten?",
    placeholder: "Was würden Sie ergänzen?",
  },
  {
    key: "q3_praxisabgleich",
    label: "Praxis-Abgleich",
    question:
      "Spiegelt das grafische Ergebnis (das Spiderweb-Diagramm) Ihre eigene, ehrliche Einschätzung Ihres Unternehmens realistisch wider?",
    placeholder: "Wo trifft es zu, wo nicht?",
  },
  {
    key: "q4_anwendbarkeit",
    label: "Anwendbarkeit",
    question:
      "Könnten Sie sich vorstellen, dieses Assessment mit Ihrer zweiten Führungsebene durchzuführen, um Wahrnehmungsunterschiede aufzudecken?",
    placeholder: "Was wäre dafür nötig?",
  },
  {
    key: "q5_verbesserung",
    label: "Verbesserung",
    question:
      "Welcher Begriff, welche Frage oder welcher Prozessschritt hat Sie beim Ausfüllen am meisten gestört?",
    placeholder: "Ganz offen …",
  },
];
