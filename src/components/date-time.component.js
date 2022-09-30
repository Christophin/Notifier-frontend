import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

export default function DateTime() {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <DateTimePicker onChange={onChange} value={value} />
    </div>
  );
}
