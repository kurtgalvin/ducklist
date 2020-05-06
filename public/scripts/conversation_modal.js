


const displayConversationModal = function (other_user_id, item_id) {

  $.get(`/api/messages/by_item_and_user/${escape(item_id)}/${escape(other_user_id)}`, data => {
    const $modal = createConversationModal(data);
    $('#conversation-modal-container').html($modal);
    $modal.modal('toggle');
  });
}

const createMessage = function(message) {
  return `
    <div class="d-flex w-100 justify-content-between">
      <h5>${escape(message.from_user_id == message.user_id ? 'Me' : message.from_user)} </h5>
      <p class="ml-3" >${escape(message.content)}</p>
    </div>
  `
}

const createConversationModal = function (data) {
  const messages = data.messages;
  const item_title = messages[0].item_title;
  const other_user = messages[0].other_user_id;
  const item_id = messages[0].item_id;
  const other_user_name = messages[0].other_user_name;

  console.log(messages);
  const $modal = $(`
<div class="modal fade" id="conversationModal" tabindex="-1" role="dialog" aria-labelledby="conversationModalTitle" aria-hidden="true"
  data-item_id="${item_id}" data-other_user="${other_user}" data-other_user_name="${other_user_name}"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="conversationModalTitle">Conversation Re: ${escape(item_title)}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <div id="messages-container"></div>
        <!-- Modal Form Content -->
        <form id="reply-message-form">

          <div class="form-group">
            <label for="message-input">Reply</label>
            <textarea name="message" class="form-control" id="reply-input" placeholder="Enter message" rows="3"></textarea required>
          </div>
        </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary" id="reply-btn" form="reply-message-form">Send</button>
      </div>
    </div>
  </div>
</div>
  `);
  const $messagesContainer = $modal.find('#messages-container');
  $messagesContainer.append(...messages.map(createMessage));

  $modal.find('#reply-btn').click(event => {
    event.preventDefault();
    const content = $("#reply-input").val();
    const formData = {to_user: other_user, content, item_id};
    // console.log(messages)
    $.post('/api/messages', formData);
    formData.from_user = messages[0].user_id;
    socket.emit('private_message', formData)
    $messagesContainer.append(createMessage({
      content: formData.content,
      from_user: 'Me',
      from_user_id: formData.from_user,
      user_id: formData.from_user
    }))
    // $messagesContainer.append(createMessage({
    //   content,
    //   user_id: messages[0].user_id,
    //   from_user_id: messages[0].from_user_id,
    //   from_user: messages[0].from_user
    // }))
    // socket.emit('private_message', {
    //   content,
    //   item_id,
    //   toId: other_user,
    //   user_id: messages[0].user_id
    // })
  });

  return $modal;
}
