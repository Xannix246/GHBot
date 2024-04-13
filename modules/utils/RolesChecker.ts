import { GuildMemberRoleManager, Interaction } from "discord.js";
import { Roles } from "global";



const RolesChecker = (interaction: Interaction, useOnlyAdmin: boolean) => {
    let allowAccess = false;
    const roles: Roles = require(`../../data/servers/${interaction?.guildId}.json`);
    let allRoles = [...roles.moderation, ...roles.administration];
    if (useOnlyAdmin) {
        allRoles = roles.administration;
    } else {
        allRoles = [...roles.moderation, ...roles.administration];
    }
    
    allRoles.forEach(element => {
        if (interaction.member?.roles instanceof GuildMemberRoleManager) {
            if (interaction.member?.roles.cache.find(role => role.id === element)) {
                allowAccess = true;
            }
        }
    })

    if(interaction.member?.user.id === interaction.guild?.ownerId) {
        allowAccess = true;
    }

    return allowAccess;
}

export default RolesChecker;