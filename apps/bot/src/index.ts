/**
 * Resell Buddy Discord Bot
 *
 * Primary user interface for many resellers.
 * Flow:
 *  1. User invites bot + runs /link (connects Discord to Whop subscription)
 *  2. Subscription is checked (Whop membership / Postgres)
 *  3. /monitor create|list|pause  — gated by plan limits
 *  4. Alerts delivered as embeds to chosen channel or DM (Pro+)
 *
 * Required env:
 *   DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID
 * Optional:
 *   APP_URL, WHOP_PRODUCT_URL
 */

import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import "dotenv/config";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const appUrl = process.env.APP_URL || "https://resell-buddy.vercel.app";
const whopProduct = process.env.WHOP_PRODUCT_URL || "https://whop.com/resell-buddy";
const whopPro = process.env.WHOP_CHECKOUT_PRO || "https://whop.com/checkout/plan_vAO3R1lqZ11UT";
const whopElite = process.env.WHOP_CHECKOUT_ELITE || "https://whop.com/checkout/plan_3aG0H3FQibNZ4";

if (!token || !clientId) {
  console.error("Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link this Discord account to your Resell Buddy / Whop subscription"),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Show your plan, monitors, and remaining capacity"),
  new SlashCommandBuilder()
    .setName("monitor")
    .setDescription("Manage monitors")
    .addSubcommand((s) =>
      s.setName("create").setDescription("Create a new monitor (opens dashboard)")
    )
    .addSubcommand((s) => s.setName("list").setDescription("List your active monitors"))
    .addSubcommand((s) =>
      s
        .setName("pause")
        .setDescription("Pause a monitor")
        .addStringOption((o) =>
          o.setName("id").setDescription("Monitor ID").setRequired(true)
        )
    ),
  new SlashCommandBuilder()
    .setName("alerts")
    .setDescription("Configure where deal alerts are sent")
    .addChannelOption((o) =>
      o.setName("channel").setDescription("Channel for deal alerts").setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("subscribe")
    .setDescription("Get Pro / Elite checkout links (Whop)"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to use Resell Buddy"),
].map((c) => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token!);
  await rest.put(Routes.applicationCommands(clientId!), { body: commands });
  console.log("Slash commands registered globally");
}

client.once(Events.ClientReady, (c) => {
  console.log(`Resell Buddy bot online as ${c.user.tag}`);
  c.user.setActivity("deals · /help", { type: 3 });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case "link":
        await handleLink(interaction);
        break;
      case "status":
        await handleStatus(interaction);
        break;
      case "monitor":
        await handleMonitor(interaction);
        break;
      case "alerts":
        await handleAlerts(interaction);
        break;
      case "subscribe":
        await handleSubscribe(interaction);
        break;
      case "help":
        await handleHelp(interaction);
        break;
      default:
        await interaction.reply({ content: "Unknown command", ephemeral: true });
    }
  } catch (err) {
    console.error(err);
    const msg = { content: "Something went wrong. Try again later.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

async function handleLink(i: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Link Resell Buddy")
    .setDescription(
      [
        "Connect your Discord account to your **Whop subscription** so monitors and alerts unlock automatically.",
        "",
        "1. Make sure you have an active plan on Whop",
        "2. Click the button below to open the dashboard",
        "3. Authorize Discord — your plan will sync",
        "",
        `No plan yet? [Get Pro](${whopPro}) or [Elite](${whopElite})`,
      ].join("\n")
    )
    .setColor(0x5865f2)
    .setFooter({ text: "Resell Buddy · Discord + Whop" });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Open dashboard & link")
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/auth/discord`),
    new ButtonBuilder()
      .setLabel("Buy on Whop")
      .setStyle(ButtonStyle.Link)
      .setURL(whopProduct)
  );

  await i.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleStatus(i: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Your Resell Buddy status")
    .setDescription(
      [
        "**Not linked yet.**",
        "",
        "Run `/link` after purchasing on Whop to sync your plan.",
        "",
        "**Plans**",
        "• Free — 1 monitor, channel alerts",
        "• Pro (€14.99/mo) — 10 monitors, DMs + roles",
        "• Elite (€29.99/mo) — unlimited + account actions",
      ].join("\n")
    )
    .setColor(0x22c55e);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Subscribe Pro")
      .setStyle(ButtonStyle.Link)
      .setURL(whopPro),
    new ButtonBuilder()
      .setLabel("Subscribe Elite")
      .setStyle(ButtonStyle.Link)
      .setURL(whopElite)
  );

  await i.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleMonitor(i: ChatInputCommandInteraction) {
  const sub = i.options.getSubcommand();
  if (sub === "create") {
    const embed = new EmbedBuilder()
      .setTitle("Create a monitor")
      .setDescription(
        `Open the dashboard to set keywords, brands, sizes, max price, and region.\n\n[Create monitor](${appUrl}/monitors/new)\n\nPlan limits are enforced there and in the workers.`
      )
      .setColor(0x5865f2);
    await i.reply({ embeds: [embed], ephemeral: true });
    return;
  }
  if (sub === "list") {
    await i.reply({
      content:
        "No monitors yet. Link your account (`/link`) and create one from the dashboard or with `/monitor create`.",
      ephemeral: true,
    });
    return;
  }
  if (sub === "pause") {
    const id = i.options.getString("id", true);
    await i.reply({
      content: `Pause request for monitor \`${id}\` received. (API wiring next — this will hit the control plane.)`,
      ephemeral: true,
    });
  }
}

async function handleAlerts(i: ChatInputCommandInteraction) {
  const channel = i.options.getChannel("channel");
  if (!channel) {
    await i.reply({
      content: "Pick a channel: `/alerts channel:#deals`",
      ephemeral: true,
    });
    return;
  }
  await i.reply({
    content: `Alerts will be sent to <#${channel.id}> once your account is linked and on **Pro** or **Elite**.`,
    ephemeral: true,
  });
}

async function handleSubscribe(i: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Resell Buddy plans")
    .setDescription(
      [
        "**Pro — €14.99 / month**",
        "10 monitors · Discord DMs + roles · shared proxies",
        "",
        "**Elite — €29.99 / month**",
        "Unlimited monitors · premium proxies · like/offer actions",
        "",
        "Yearly options save ~17%. Checkout is on Whop.",
      ].join("\n")
    )
    .setColor(0x22c55e)
    .setURL(whopProduct);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("Pro €14.99/mo").setStyle(ButtonStyle.Link).setURL(whopPro),
    new ButtonBuilder().setLabel("Elite €29.99/mo").setStyle(ButtonStyle.Link).setURL(whopElite),
    new ButtonBuilder().setLabel("All plans").setStyle(ButtonStyle.Link).setURL(whopProduct)
  );

  await i.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleHelp(i: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Resell Buddy — help")
    .setDescription(
      [
        "**Commands**",
        "`/link` — connect Discord to your Whop subscription",
        "`/status` — plan + monitor capacity",
        "`/monitor create|list|pause` — manage monitors",
        "`/alerts` — set alert channel",
        "`/subscribe` — checkout links",
        "",
        "**Flow**",
        "1. Buy Pro or Elite on Whop",
        "2. Invite this bot to your server",
        "3. `/link` → authorize",
        "4. Create monitors + set `/alerts`",
        "",
        "Independent tool. Not affiliated with any marketplace.",
      ].join("\n")
    )
    .setColor(0x5865f2);

  await i.reply({ embeds: [embed], ephemeral: true });
}

registerCommands()
  .then(() => client.login(token))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
