import {
  Client,
  Partials,
  IntentsBitField,
  BitFieldResolvable,
  GatewayIntentsString,
  Collection,
  ApplicationCommandDataResolvable,
  ClientEvents,
} from "discord.js";
import dotenv from "dotenv";
import {
  CommandType,
  ComponentsButton,
  ComponentsModal,
  ComponentsSelect,
} from "./types/Command";
dotenv.config();
import fs, { readdirSync } from "fs";
import path, { sep } from "path";
import { EventType } from "./types/event";
import { actionEvent } from "../classes/actions";
export * from "colors";
const fileCondition = (fileName: string) =>
  fileName.endsWith(".ts") || fileName.endsWith(".js");

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public infinityActions: Collection<string, actionEvent> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();

  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }
  public start() {
    this.registerModules();
    this.registerEvents();
    this.registerActions();
    this.login(process.env.TOKEN);
  }
  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        console.log(`(Commands) Carregando comandos (/) da aplicação`.rainbow);
        setTimeout(() => {
          console.log(
            "✅ (Commands) Os comandos (/) da aplicação foram carregados com sucesso."
              .green
          );
        }, 5000);
      })
      .catch((err) => {
        console.log(
          `❌ Um erro aconteceu ao tentar definir o Slash Commands (/):\n ${err}`
            .red
        );
      });
  }
  private registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();
    const commandPath = path.join(__dirname, "..", "commands");
    const fileCondition = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".js");

    fs.readdirSync(commandPath).forEach((local) => {
      fs.readdirSync(commandPath + `/${local}/`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const command: CommandType = (
            await import(`../commands/${local}/${fileName}`)
          )?.default;
          const { name, button, selects, modals } = command;

          if (name) {
            this.commands.set(name, command);
            slashCommands.push(command);
            if (button)
              button.forEach((run, key) => this.buttons.set(key, run));
            if (selects)
              selects.forEach((run, key) => this.selects.set(key, run));
            if (modals) modals.forEach((run, key) => this.modals.set(key, run));
          }
        });
    });
    this.on("ready", () => this.registerCommands(slashCommands));
  }
  private registerEvents() {
    const eventsPath = path.join(__dirname, "..", "events");

    fs.readdirSync(eventsPath).forEach((local) => {
      fs.readdirSync(`${eventsPath}/${local}`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const { name, once, run }: EventType<keyof ClientEvents> = (
            await import(`../events/${local}/${fileName}`)
          )?.default;
          try {
            if (name) once ? this.once(name, run) : this.on(name, run);
          } catch (error) {
            console.error(`Erro ocorrido no event ${name}: ${error}`);
          }
        });
    });
  }
  private registerActions() {
    const dir = path.join(__dirname, "../useCases");
    readdirSync(dir).forEach(async (dirs) => { // useCases/buttons  useCases/menus
      readdirSync(`${dir}/${dirs}`).forEach(async (sub) => { // useCases/buttons/economy 
        const events = readdirSync(
          `${dir}${sep}${dirs}${sep}${sub}/${sep}`
        ).filter((files) => files.endsWith(".ts") || files.endsWith(".js"));
        for (const file of events) {
          try {
            const event = await import(`${dir}/${dirs}/${sub}/${file}`);
            const action: actionEvent = new event.default(this);

            console.log(`[Action] - ${action.config.event} loaded`);
            this.infinityActions.set(action.config.event, action);
          } catch (err) {}
        }
      });
    });
  }
}
