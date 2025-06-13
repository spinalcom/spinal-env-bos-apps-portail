function displayDate(dateTime: number) {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function toManageableTicket(ticket: any) {
    return {
        id: ticket.dynamicId,
        Nom: ticket.name,
        Étape: ticket.step.name,
        Domaine: ticket.process.name,
        "Date de création": displayDate(
            ticket.creationDate || ticket.log_list[0]?.date || 0
        ),
        "Dernière modification": displayDate(
            ticket.directModificationDate ||
            ticket.log_list[ticket.log_list?.length - 1]?.date ||
            0
        ),
        Déclarant: ticket.userName || "ADMIN",
        color: ticket.step.color,
        attachement: ticket.file_list.length > 0,
    };
}
